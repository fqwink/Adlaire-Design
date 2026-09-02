/* Adlaire-Design editor core */
(function () {
  "use strict";

  function clone(value) {
    return value === undefined ? value : JSON.parse(JSON.stringify(value));
  }

  function asRecord(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function createEmptyDocument(id, schemaVersion) {
    return { id: id || "document", schemaVersion: schemaVersion || "1.0.0", blocks: [] };
  }

  function createId(prefix) {
    return (prefix || "block") + "-" + Math.random().toString(36).slice(2, 10);
  }

  function createBlock(type, data, options) {
    var id = typeof options === "string" ? options : options && options.id;
    return { id: id || createId(type), type: type, data: data || {} };
  }

  function ToolRegistry(tools, blockOnly) {
    this.tools = {};
    this.blockOnly = Boolean(blockOnly);
    (tools || []).forEach(this.register.bind(this));
  }
  ToolRegistry.prototype.register = function (tool) {
    if (!tool || typeof tool.type !== "string" || typeof tool.kind !== "string") throw new Error("Editor tool must define type and kind.");
    if (this.blockOnly && tool.kind !== "block") throw new Error("Tool '" + tool.type + "' is not a block tool.");
    this.tools[tool.type] = tool;
  };
  ToolRegistry.prototype.get = function (type) {
    return this.tools[type];
  };
  ToolRegistry.prototype.has = function (type) {
    return Boolean(this.tools[type]);
  };
  ToolRegistry.prototype.list = function () {
    var registry = this.tools;
    return Object.keys(registry).map(function (type) { return registry[type]; });
  };
  ToolRegistry.prototype.values = ToolRegistry.prototype.list;

  function BlockRegistry(tools) {
    ToolRegistry.call(this, tools, true);
  }
  BlockRegistry.prototype = Object.create(ToolRegistry.prototype);
  BlockRegistry.prototype.constructor = BlockRegistry;

  function createDefaultInlineTools() {
    return ["bold", "italic", "link", "code", "strike"].map(function (type) {
      return { type: type, kind: "inline", validate: function (data) { return type !== "link" || typeof asRecord(data).href === "string"; }, sanitize: {} };
    });
  }

  function createDefaultBlockTools() {
    return [
      { type: "paragraph", kind: "block", create: function () { return { text: [] }; }, normalize: function (data) { return { text: sanitizeInlineContent(asRecord(data).text) }; }, validate: function (data) { return validateInlineContent(asRecord(data).text); }, merge: mergeInlineText, sanitize: {} },
      { type: "heading", kind: "block", create: function () { return { level: 2, text: [] }; }, normalize: function (data) { return { level: normalizeLevel(asRecord(data).level), text: sanitizeInlineContent(asRecord(data).text) }; }, validate: function (data) { return isLevel(asRecord(data).level) && validateInlineContent(asRecord(data).text); }, merge: mergeInlineTextWithLevel, sanitize: {} },
      { type: "list", kind: "block", create: function () { return { style: "unordered", items: [] }; }, normalize: function (data) { return { style: normalizeListStyle(asRecord(data).style), items: normalizeListItems(asRecord(data).items) }; }, validate: function (data) { return isListStyle(asRecord(data).style) && Array.isArray(asRecord(data).items); }, merge: function (left, right) { return { style: normalizeListStyle(asRecord(left).style), items: normalizeListItems(asRecord(left).items).concat(normalizeListItems(asRecord(right).items)) }; }, sanitize: {} },
      { type: "code", kind: "block", create: function () { return { code: "" }; }, normalize: function (data) { return Object.assign({ code: typeof asRecord(data).code === "string" ? asRecord(data).code : "" }, typeof asRecord(data).language === "string" ? { language: asRecord(data).language } : {}); }, validate: function (data) { return typeof asRecord(data).code === "string"; }, merge: function (left, right) { return Object.assign({ code: String(asRecord(left).code || "") + "\n" + String(asRecord(right).code || "") }, typeof asRecord(left).language === "string" ? { language: asRecord(left).language } : {}); }, sanitize: {} },
      { type: "quote", kind: "block", create: function () { return { text: [] }; }, normalize: function (data) { return { text: sanitizeInlineContent(asRecord(data).text) }; }, validate: function () { return true; }, merge: mergeInlineText, sanitize: {} },
      { type: "image", kind: "block", create: function () { return { src: "", alt: "" }; }, normalize: function (data) { return { src: String(asRecord(data).src || ""), alt: String(asRecord(data).alt || "") }; }, validate: function (data) { return typeof asRecord(data).src === "string"; }, sanitize: {} },
      { type: "file", kind: "block", create: function () { return { href: "", label: "" }; }, normalize: function (data) { return { href: String(asRecord(data).href || ""), label: String(asRecord(data).label || "") }; }, validate: function (data) { return typeof asRecord(data).href === "string"; }, sanitize: {} },
      { type: "divider", kind: "block", create: function () { return {}; }, normalize: function () { return {}; }, validate: function () { return true; }, sanitize: {} },
      { type: "callout", kind: "block", create: function () { return { tone: "info", text: [] }; }, normalize: function (data) { return { tone: String(asRecord(data).tone || "info"), text: sanitizeInlineContent(asRecord(data).text) }; }, validate: function () { return true; }, allowsChildren: true, sanitize: {} },
      { type: "component", kind: "block", create: function () { return {}; }, normalize: function (data) { return Object.assign({}, asRecord(data)); }, validate: function () { return true; }, allowsChildren: true, sanitize: {} },
      { type: "unsupported", kind: "block", create: function () { return { originalType: "unknown", originalData: {} }; }, normalize: function (data) { return { originalType: typeof asRecord(data).originalType === "string" ? asRecord(data).originalType : "unknown", originalData: asRecord(asRecord(data).originalData) }; }, validate: function (data) { return typeof asRecord(data).originalType === "string"; }, sanitize: {} }
    ];
  }

  function createDefaultToolRegistry(tools) {
    return new ToolRegistry(createDefaultBlockTools().concat(createDefaultInlineTools(), tools || []));
  }

  function createDefaultBlockRegistry(tools) {
    return new BlockRegistry(createDefaultBlockTools().concat((tools || []).filter(function (tool) { return tool.kind === "block"; })));
  }

  function normalizeDocument(document, registry) {
    registry = registry || createDefaultBlockRegistry();
    return {
      id: typeof (document && document.id) === "string" && document.id ? document.id : "document",
      schemaVersion: typeof (document && document.schemaVersion) === "string" && document.schemaVersion ? document.schemaVersion : "1.0.0",
      blocks: Array.isArray(document && document.blocks) ? document.blocks.map(function (block) { return normalizeBlock(block, registry); }) : [],
      meta: document && document.meta ? clone(asRecord(document.meta)) : undefined
    };
  }

  function normalizeBlock(block, registry) {
    var rawType = typeof (block && block.type) === "string" && block.type ? block.type : "unsupported";
    var type = registry && registry.has(rawType) ? rawType : "unsupported";
    var rawData = asRecord(clone((block && block.data) || {}));
    var tool = registry && registry.get(type);
    var data = type === "unsupported" && rawType !== "unsupported" ? { originalType: rawType, originalData: rawData } : asRecord(tool && tool.normalize ? tool.normalize(rawData) : rawData);
    var normalized = {
      id: typeof (block && block.id) === "string" && block.id ? block.id : stableId(rawType, rawData),
      type: type,
      data: data
    };
    if (block && block.meta) normalized.meta = clone(block.meta);
    if (block && Array.isArray(block.children) && block.children.length) normalized.children = block.children.map(function (child) { return normalizeBlock(child, registry); });
    return normalized;
  }

  function flattenBlocks(document) {
    var result = [];
    function visit(blocks) {
      (blocks || []).forEach(function (block) {
        result.push(block);
        if (block.children) visit(block.children);
      });
    }
    visit(document && document.blocks);
    return result;
  }

  function findBlock(document, blockId) {
    return flattenBlocks(document).filter(function (block) { return block.id === blockId; })[0] || null;
  }

  function findBlockLocation(blocks, blockId, parent) {
    for (var index = 0; index < (blocks || []).length; index += 1) {
      var block = blocks[index];
      if (block.id === blockId) return { block: block, index: index, siblings: blocks, parent: parent || null };
      var child = findBlockLocation(block.children || [], blockId, block);
      if (child) return child;
    }
    return null;
  }

  function collectBlockIds(blocks) {
    var ids = {};
    (function visit(items) {
      (items || []).forEach(function (block) {
        ids[block.id] = true;
        if (block.children) visit(block.children);
      });
    })(blocks);
    return ids;
  }

  function validateDocument(document, registry, selection) {
    registry = registry || createDefaultBlockRegistry();
    if (!document || typeof document !== "object") return { valid: false, errors: [editorError("document.invalid", "Document must be an object.")], warnings: [] };
    if (!Array.isArray(document.blocks)) return { valid: false, errors: [editorError("document.blocks.invalid", "Document blocks must be an array.")], warnings: [] };
    var ids = {};
    var errors = [];
    var warnings = [];
    if (!document.id) errors.push(editorError("document.id.required", "Document id is required."));
    if (!document.schemaVersion) errors.push(editorError("document.schemaVersion.required", "Document schemaVersion is required."));
    flattenBlocks(document).forEach(function (block) {
      if (ids[block.id]) errors.push(editorError("block.id.duplicate", "Duplicate block id '" + block.id + "'.", block.id));
      ids[block.id] = true;
      var result = validateBlock(block, registry);
      errors = errors.concat(result.errors);
      warnings = warnings.concat(result.warnings);
    });
    if (selection) {
      if (!ids[selection.anchor && selection.anchor.blockId]) errors.push(editorError("selection.anchor.invalid", "Selection anchor references a missing block."));
      if (!ids[selection.focus && selection.focus.blockId]) errors.push(editorError("selection.focus.invalid", "Selection focus references a missing block."));
    }
    return { valid: errors.length === 0, errors: errors, warnings: warnings };
  }

  function validateBlock(block, registry) {
    var errors = [];
    var warnings = [];
    if (!block || typeof block !== "object") return { valid: false, errors: [editorError("block.invalid", "Block must be an object.")], warnings: [] };
    if (!block.id) errors.push(editorError("block.id.required", "Block id is required."));
    if (!block.type) errors.push(editorError("block.type.required", "Block type is required.", block.id));
    if (block.type === "unsupported") warnings.push(editorError("block.unsupported", "Unsupported block is preserved.", block.id));
    var tool = registry && registry.get(block.type);
    if (tool && tool.validate && tool.validate(asRecord(block.data)) === false) errors.push(editorError("block.data.invalid", "Block data is invalid.", block.id));
    return { valid: errors.length === 0, errors: errors, warnings: warnings };
  }

  function validateDocumentAsync(document, registry, selection) {
    return Promise.resolve(validateDocument(document, registry, selection));
  }

  function sanitizeDocument(document, registry) {
    var next = normalizeDocument(document, registry);
    next.blocks = next.blocks.map(function (block) { return sanitizeBlock(block, registry); });
    return next;
  }

  function sanitizeBlock(block, registry) {
    var next = registry ? normalizeBlock(block, registry) : clone(block);
    sanitizeValue(next.data);
    if (next.children) next.children = next.children.map(function (child) { return sanitizeBlock(child, registry); });
    return next;
  }

  function sanitizeValue(value) {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(sanitizeValue);
      return;
    }
    if (Array.isArray(value.marks)) {
      value.marks = value.marks.filter(function (mark) {
        return !(mark && mark.type === "link" && typeof mark.href === "string" && !isSafeHref(mark.href));
      });
      if (value.marks.length === 0) delete value.marks;
    }
    if (value.type === "link" && typeof value.href === "string" && !isSafeHref(value.href)) delete value.href;
    Object.keys(value).forEach(function (key) { sanitizeValue(value[key]); });
  }

  function normalizeSelection(document, selection) {
    if (!selection) return null;
    if (!isValidPosition(document, selection.anchor) || !isValidPosition(document, selection.focus)) return null;
    return {
      mode: selection.mode || "caret",
      anchor: normalizePosition(selection.anchor),
      focus: normalizePosition(selection.focus)
    };
  }

  function isValidPosition(document, position) {
    if (!position || !findBlock(document, position.blockId)) return false;
    if (!position.path || !position.path.length) return true;
    var value = findBlock(document, position.blockId).data;
    for (var index = 0; index < position.path.length; index += 1) {
      if (value === null || value === undefined) return false;
      value = value[position.path[index]];
    }
    return typeof position.offset !== "number" || typeof value === "string";
  }

  function normalizePosition(position) {
    var normalized = { blockId: position.blockId };
    if (position.path) normalized.path = position.path.slice();
    if (typeof position.offset === "number") normalized.offset = position.offset;
    return normalized;
  }

  function sameSelection(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  function getFirstBlockPosition(document) {
    var block = flattenBlocks(document)[0];
    return block ? { blockId: block.id } : null;
  }

  function getLastBlockPosition(document) {
    var blocks = flattenBlocks(document);
    var block = blocks[blocks.length - 1];
    return block ? { blockId: block.id } : null;
  }

  function getNextBlockPosition(document, blockId) {
    var blocks = flattenBlocks(document);
    var index = blocks.findIndex(function (block) { return block.id === blockId; });
    return index >= 0 && blocks[index + 1] ? { blockId: blocks[index + 1].id } : null;
  }

  function getPreviousBlockPosition(document, blockId) {
    var blocks = flattenBlocks(document);
    var index = blocks.findIndex(function (block) { return block.id === blockId; });
    return index > 0 ? { blockId: blocks[index - 1].id } : null;
  }

  function EventBus() {
    this.listeners = [];
  }
  EventBus.prototype.subscribe = function (listener) {
    var listeners = this.listeners;
    listeners.push(listener);
    return function () {
      var index = listeners.indexOf(listener);
      if (index >= 0) listeners.splice(index, 1);
    };
  };
  EventBus.prototype.emit = function (event) {
    this.listeners.slice().forEach(function (listener) { listener(event); });
  };
  EventBus.prototype.clear = function () {
    this.listeners.length = 0;
  };

  function History(limit) {
    this.limit = Math.max(1, limit || 100);
    this.undos = [];
    this.redos = [];
  }
  History.prototype.push = function (snapshot) {
    this.undos.push(clone(snapshot));
    this.redos.length = 0;
    if (this.undos.length > this.limit) this.undos.shift();
  };
  History.prototype.undo = function (current) {
    var snapshot = this.undos.pop();
    if (!snapshot) return null;
    this.redos.push({ before: snapshot.before, after: clone(current), commands: snapshot.commands });
    return clone(snapshot);
  };
  History.prototype.redo = function (current) {
    var snapshot = this.redos.pop();
    if (!snapshot) return null;
    this.undos.push({ before: clone(current), after: snapshot.after, commands: snapshot.commands });
    return clone(snapshot);
  };
  Object.defineProperty(History.prototype, "canUndo", { get: function () { return this.undos.length > 0; } });
  Object.defineProperty(History.prototype, "canRedo", { get: function () { return this.redos.length > 0; } });

  var mutableCommands = {
    "insert-block": true,
    "delete-block": true,
    "move-block": true,
    "update-block": true,
    "split-block": true,
    "merge-block": true,
    "set-document-meta": true
  };

  function HeadlessEditorController(config) {
    config = config || {};
    var defaultBlock = config.defaultBlock || "paragraph";
    this.registry = createDefaultBlockRegistry(config.tools || []);
    if (!this.registry.has(defaultBlock)) throw new Error("Default block '" + defaultBlock + "' is not registered.");
    this.events = new EventBus();
    this.history = new History(config.historyLimit);
    this.readOnly = Boolean(config.readOnly);
    this.document = normalizeDocument(config.document || createEmptyDocument(), this.registry);
    this.selection = null;
    this.saveState = { dirty: false, saving: false };
    this.emitValidation();
  }

  HeadlessEditorController.prototype.getDocument = function () {
    return clone(this.document);
  };
  HeadlessEditorController.prototype.setDocument = function (document) {
    this.document = sanitizeDocument(normalizeDocument(document, this.registry), this.registry);
    this.selection = normalizeSelection(this.document, this.selection);
    this.saveState = { dirty: false, saving: false };
    this.events.emit({ type: "document:changed", document: this.getDocument() });
    this.events.emit({ type: "selection:changed", selection: this.getSelection() });
    this.emitValidation();
  };
  HeadlessEditorController.prototype.canDispatch = function (command) {
    return isEditorCommand(command) && isKnownCommand(command.type) && !(this.readOnly && mutableCommands[command.type]);
  };
  HeadlessEditorController.prototype.dispatch = function (command) {
    if (!isEditorCommand(command)) return this.fail("command.invalid", "Command must be an object with a string type.");
    if (!isKnownCommand(command.type)) return this.fail("command.unknown", "Command '" + command.type + "' is not registered.");
    if (!this.canDispatch(command)) return this.fail("command.readOnly", "Command '" + command.type + "' is not allowed in read-only mode.");
    if (command.type === "set-selection") return this.setSelectionResult((command.payload || {}).selection || null, true);
    if (command.type === "save") return { document: this.getDocument(), selection: this.getSelection(), changed: false, request: this.save((command.payload || {}).context) };
    if (command.type === "request-publish") return { document: this.getDocument(), selection: this.getSelection(), changed: false, request: this.requestPublish((command.payload || {}).context) };
    return this.applyDocumentCommand(command, true);
  };
  HeadlessEditorController.prototype.dispatchBatch = function (commands) {
    if (!Array.isArray(commands)) return this.fail("command.batch.invalid", "Batch payload must be an array of commands.");
    if (!commands.length) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    var before = { document: this.getDocument(), selection: this.getSelection() };
    var nextDocument = this.document;
    var nextSelection = this.selection;
    var hasDocumentChange = false;
    var hasSelectionChange = false;
    var errors = [];
    for (var index = 0; index < commands.length; index += 1) {
      var command = commands[index];
      if (!isEditorCommand(command)) { errors.push(editorError("command.invalid", "Command must be an object with a string type.")); break; }
      if (!isKnownCommand(command.type)) { errors.push(editorError("command.unknown", "Command '" + command.type + "' is not registered.")); break; }
      if (command.type === "save" || command.type === "request-publish") { errors.push(editorError("command.batch.unsupported", "Save and publish commands cannot be batched.")); break; }
      if (this.readOnly && mutableCommands[command.type]) { errors.push(editorError("command.readOnly", "Command '" + command.type + "' is not allowed in read-only mode.")); break; }
      if (command.type === "set-selection") {
        var normalized = normalizeSelection(nextDocument, (command.payload || {}).selection || null);
        if ((command.payload || {}).selection !== null && normalized === null) { errors.push(editorError("selection.invalid", "Selection must reference valid document positions.")); break; }
        hasSelectionChange = hasSelectionChange || !sameSelection(nextSelection, normalized);
        nextSelection = normalized;
        continue;
      }
      var result = applyCommand(nextDocument, command, this.registry);
      if (result.errors.length) { errors = errors.concat(result.errors); break; }
      if (result.changed) hasDocumentChange = true;
      nextDocument = sanitizeDocument(normalizeDocument(result.document, this.registry), this.registry);
      nextSelection = normalizeSelection(nextDocument, nextSelection);
    }
    if (errors.length) {
      errors.forEach(this.emitError.bind(this));
      return { document: this.getDocument(), selection: this.getSelection(), changed: false, errors: errors };
    }
    if (!hasDocumentChange && !hasSelectionChange) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    this.document = nextDocument;
    this.selection = nextSelection;
    if (hasDocumentChange) this.saveState.dirty = true;
    this.history.push({ before: before, after: { document: this.getDocument(), selection: this.getSelection() }, commands: commands });
    this.emitChanged(hasDocumentChange);
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  };
  HeadlessEditorController.prototype.getSelection = function () {
    return this.selection ? clone(this.selection) : null;
  };
  HeadlessEditorController.prototype.setSelection = function (selection) {
    this.setSelectionResult(selection, false);
  };
  HeadlessEditorController.prototype.setSelectionResult = function (selection, pushHistory) {
    var normalized = normalizeSelection(this.document, selection || null);
    if (selection !== null && normalized === null) return this.fail("selection.invalid", "Selection must reference valid document positions.");
    if (sameSelection(this.selection, normalized)) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    var before = { document: this.getDocument(), selection: this.getSelection() };
    this.selection = normalized;
    if (pushHistory) this.history.push({ before: before, after: { document: this.getDocument(), selection: this.getSelection() }, commands: [{ type: "set-selection", payload: { selection: selection } }] });
    this.emitChanged(false);
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  };
  HeadlessEditorController.prototype.undo = function () {
    var snapshot = this.history.undo({ document: this.getDocument(), selection: this.getSelection() });
    if (!snapshot) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    this.document = snapshot.before.document;
    this.selection = snapshot.before.selection;
    this.saveState.dirty = true;
    this.emitChanged(true);
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  };
  HeadlessEditorController.prototype.redo = function () {
    var snapshot = this.history.redo({ document: this.getDocument(), selection: this.getSelection() });
    if (!snapshot) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    this.document = snapshot.after.document;
    this.selection = snapshot.after.selection;
    this.saveState.dirty = true;
    this.emitChanged(true);
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  };
  HeadlessEditorController.prototype.save = function (context) {
    var document = sanitizeDocument(this.document, this.registry);
    var validation = validateDocument(document, this.registry);
    validation.errors.forEach(this.emitError.bind(this));
    var request = { document: document, context: context || { reason: "manual" }, state: Object.assign({}, this.saveState, { saving: true, lastRequestedAt: new Date().toISOString() }) };
    this.saveState = request.state;
    this.events.emit({ type: "save:requested", request: request });
    return request;
  };
  HeadlessEditorController.prototype.requestPublish = function (context) {
    var document = sanitizeDocument(this.document, this.registry);
    var request = { document: document, context: context || { reason: "manual" }, validation: validateDocument(document, this.registry) };
    this.events.emit({ type: "publish:requested", request: request });
    return request;
  };
  HeadlessEditorController.prototype.subscribe = function (listener) {
    return this.events.subscribe(listener);
  };
  HeadlessEditorController.prototype.destroy = function () {
    this.events.clear();
  };
  HeadlessEditorController.prototype.applyDocumentCommand = function (command, pushHistory) {
    var before = { document: this.getDocument(), selection: this.getSelection() };
    var result = applyCommand(this.document, command, this.registry);
    if (!result.changed || result.errors.length) {
      result.errors.forEach(this.emitError.bind(this));
      return { document: this.getDocument(), selection: this.getSelection(), changed: false, errors: result.errors };
    }
    this.document = sanitizeDocument(normalizeDocument(result.document, this.registry), this.registry);
    this.selection = normalizeSelection(this.document, this.selection);
    this.saveState.dirty = true;
    if (pushHistory) this.history.push({ before: before, after: { document: this.getDocument(), selection: this.getSelection() }, commands: [command] });
    this.emitChanged(true);
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  };
  HeadlessEditorController.prototype.emitChanged = function (documentChanged) {
    if (documentChanged) this.events.emit({ type: "document:changed", document: this.getDocument() });
    this.events.emit({ type: "selection:changed", selection: this.getSelection() });
    this.events.emit({ type: "history:changed", canUndo: this.history.canUndo, canRedo: this.history.canRedo });
    this.emitValidation();
  };
  HeadlessEditorController.prototype.emitValidation = function () {
    var validation = validateDocument(this.document, this.registry, this.selection);
    this.events.emit({ type: "validation:changed", validation: validation });
    validation.errors.forEach(this.emitError.bind(this));
  };
  HeadlessEditorController.prototype.emitError = function (failure) {
    this.events.emit({ type: "error", error: failure });
  };
  HeadlessEditorController.prototype.fail = function (code, message) {
    var failure = editorError(code, message);
    this.emitError(failure);
    return { document: this.getDocument(), selection: this.getSelection(), changed: false, errors: [failure] };
  };

  function applyCommand(document, command, registry) {
    if (command.type === "insert-block") return insertBlock(document, command.payload || {}, registry);
    if (command.type === "delete-block") return deleteBlock(document, command.payload || {});
    if (command.type === "update-block") return updateBlock(document, command.payload || {}, registry);
    if (command.type === "move-block") return moveBlock(document, command.payload || {}, registry);
    if (command.type === "split-block") return splitBlock(document, command.payload || {}, registry);
    if (command.type === "merge-block") return mergeBlock(document, command.payload || {}, registry);
    if (command.type === "set-document-meta") return setDocumentMeta(document, command.payload || {});
    return failed(document, "command.unknown", "Unknown command.");
  }

  function insertBlock(document, payload, registry) {
    if (!payload.block || !payload.block.id || !payload.block.type) return failed(document, "command.payload.invalid", "insert-block requires a block.");
    var block = registry ? normalizeBlock(payload.block, registry) : clone(payload.block);
    if (collectBlockIds(document.blocks)[block.id]) return failed(document, "block.id.duplicate", "Block id '" + block.id + "' already exists.", block.id);
    if (payload.parentBlockId) {
      var parent = findBlock(document, payload.parentBlockId);
      if (!parent) return failed(document, "block.parent.notFound", "Parent block was not found.", payload.parentBlockId);
      var parentTool = registry && registry.get(parent.type);
      if (parentTool && !parentTool.allowsChildren) return failed(document, "block.children.notAllowed", "Parent block does not allow nested blocks.", parent.id);
      return changed(Object.assign({}, document, { blocks: updateBlockById(document.blocks, parent.id, function (target) { return Object.assign({}, target, { children: insertAt(target.children || [], block, payload.index) }); }) }));
    }
    return changed(Object.assign({}, document, { blocks: insertAt(document.blocks, block, payload.index) }));
  }

  function deleteBlock(document, payload) {
    if (typeof payload.blockId !== "string") return failed(document, "command.payload.invalid", "delete-block requires blockId.");
    var removed = removeBlockById(document.blocks, payload.blockId);
    if (!removed.block) return failed(document, "block.notFound", "Block was not found.", payload.blockId);
    return changed(Object.assign({}, document, { blocks: removed.blocks }));
  }

  function updateBlock(document, payload, registry) {
    if (typeof payload.blockId !== "string") return failed(document, "command.payload.invalid", "update-block requires blockId.");
    var target = findBlock(document, payload.blockId);
    if (!target) return failed(document, "block.notFound", "Block was not found.", payload.blockId);
    if (target.type === "unsupported" && payload.data !== undefined) return failed(document, "block.unsupported.readOnly", "Unsupported block data is read-only.", payload.blockId);
    return changed(Object.assign({}, document, { blocks: updateBlockById(document.blocks, payload.blockId, function (block) {
      var next = Object.assign({}, block, payload.data === undefined ? {} : { data: asRecord(payload.data) }, payload.meta === undefined ? {} : { meta: Object.assign({}, block.meta || {}, payload.meta) });
      return registry ? normalizeBlock(next, registry) : next;
    }) }));
  }

  function moveBlock(document, payload, registry) {
    if (typeof payload.blockId !== "string" || typeof payload.toIndex !== "number") return failed(document, "command.payload.invalid", "move-block requires blockId and toIndex.", payload.blockId);
    var source = findBlockLocation(document.blocks, payload.blockId);
    if (!source) return failed(document, "block.notFound", "Block was not found.", payload.blockId);
    if (payload.fromParentBlockId !== undefined && (!source.parent || source.parent.id !== payload.fromParentBlockId)) return failed(document, "block.parent.mismatch", "Source block parent does not match fromParentBlockId.", payload.blockId);
    var removed = removeBlockById(document.blocks, payload.blockId);
    if (payload.toParentBlockId) {
      var parent = findBlock(Object.assign({}, document, { blocks: removed.blocks }), payload.toParentBlockId);
      if (!parent) return failed(document, "block.parent.notFound", "Target parent block was not found.", payload.toParentBlockId);
      var parentTool = registry && registry.get(parent.type);
      if (parentTool && !parentTool.allowsChildren) return failed(document, "block.children.notAllowed", "Parent block does not allow nested blocks.", parent.id);
      return changed(Object.assign({}, document, { blocks: updateBlockById(removed.blocks, parent.id, function (target) { return Object.assign({}, target, { children: insertAt(target.children || [], removed.block, payload.toIndex) }); }) }));
    }
    return changed(Object.assign({}, document, { blocks: insertAt(removed.blocks, removed.block, payload.toIndex) }));
  }

  function splitBlock(document, payload, registry) {
    if (typeof payload.blockId !== "string") return failed(document, "command.payload.invalid", "split-block requires blockId.", payload.blockId);
    var location = findBlockLocation(document.blocks, payload.blockId);
    if (!location) return failed(document, "block.notFound", "Block was not found.", payload.blockId);
    if (location.block.type === "unsupported") return failed(document, "block.unsupported.split", "Unsupported block cannot be split.", payload.blockId);
    var newId = location.block.id + "-split";
    if (collectBlockIds(document.blocks)[newId]) return failed(document, "block.id.duplicate", "Split id already exists.", newId);
    var split = splitBlockData(location.block, payload);
    if (split.error) return { document: document, changed: false, errors: [split.error] };
    var nextSiblings = location.siblings.slice(0, location.index).concat([registry ? normalizeBlock(split.blocks[0], registry) : split.blocks[0], registry ? normalizeBlock(split.blocks[1], registry) : split.blocks[1]], location.siblings.slice(location.index + 1));
    if (!location.parent) return changed(Object.assign({}, document, { blocks: nextSiblings }));
    return changed(Object.assign({}, document, { blocks: updateBlockById(document.blocks, location.parent.id, function (parent) { return Object.assign({}, parent, { children: nextSiblings }); }) }));
  }

  function mergeBlock(document, payload, registry) {
    if (typeof payload.sourceBlockId !== "string" || typeof payload.targetBlockId !== "string") return failed(document, "command.payload.invalid", "merge-block requires sourceBlockId and targetBlockId.");
    if (payload.sourceBlockId === payload.targetBlockId) return failed(document, "block.merge.sameBlock", "Cannot merge a block into itself.", payload.sourceBlockId);
    var source = findBlock(document, payload.sourceBlockId);
    var target = findBlock(document, payload.targetBlockId);
    if (!source || !target) return failed(document, "block.notFound", "Merge source or target was not found.");
    if (source.type === "unsupported" || target.type === "unsupported") return failed(document, "block.unsupported.merge", "Unsupported block cannot be merged.");
    if (source.type !== target.type) return failed(document, "block.merge.typeMismatch", "Only blocks of the same type can be merged.");
    var tool = registry && registry.get(target.type);
    var mergedData = tool && tool.merge ? asRecord(tool.merge(target.data, source.data)) : Object.assign({}, target.data, source.data);
    var withoutSource = removeBlockById(document.blocks, source.id).blocks;
    return changed(Object.assign({}, document, { blocks: updateBlockById(withoutSource, target.id, function (block) { return registry ? normalizeBlock(Object.assign({}, block, { data: mergedData }), registry) : Object.assign({}, block, { data: mergedData }); }) }));
  }

  function setDocumentMeta(document, payload) {
    if (!payload || !payload.meta || typeof payload.meta !== "object") return failed(document, "command.payload.invalid", "set-document-meta requires meta.");
    return changed(Object.assign({}, document, { meta: payload.merge === false ? clone(payload.meta) : Object.assign({}, document.meta || {}, payload.meta) }));
  }

  function insertAt(blocks, block, index) {
    var next = (blocks || []).map(clone);
    next.splice(Math.max(0, Math.min(typeof index === "number" ? index : next.length, next.length)), 0, clone(block));
    return next;
  }

  function removeBlockById(blocks, blockId) {
    var removed = null;
    var next = (blocks || []).reduce(function (items, block) {
      if (block.id === blockId) {
        removed = clone(block);
        return items;
      }
      var copy = clone(block);
      if (block.children) {
        var child = removeBlockById(block.children, blockId);
        if (child.block) removed = child.block;
        copy.children = child.blocks;
      }
      items.push(copy);
      return items;
    }, []);
    return { blocks: next, block: removed };
  }

  function updateBlockById(blocks, blockId, updater) {
    return (blocks || []).map(function (block) {
      if (block.id === blockId) return updater(clone(block));
      var copy = clone(block);
      if (copy.children) copy.children = updateBlockById(copy.children, blockId, updater);
      return copy;
    });
  }

  function splitBlockData(block, payload) {
    if (block.type === "code" && payload.position && payload.position.path && payload.position.path[0] === "code" && typeof block.data.code === "string") {
      var offset = validOffset(payload.position.offset, block.data.code.length);
      if (offset === null) return { error: editorError("block.split.unsupported", "Split position is outside editable text.", block.id) };
      return { blocks: [
        Object.assign({}, block, { data: Object.assign({}, block.data, { code: block.data.code.slice(0, offset) }) }),
        Object.assign({}, block, { id: block.id + "-split", data: Object.assign({}, block.data, { code: block.data.code.slice(offset) }) })
      ] };
    }
    if (payload.position && payload.position.path && payload.position.path[0] === "text" && typeof payload.position.path[1] === "number" && payload.position.path[2] === "text") {
      var items = Array.isArray(block.data.text) ? block.data.text.map(clone) : null;
      var index = payload.position.path[1];
      var item = items && items[index];
      if (!items || !item || typeof item !== "object" || item.type !== "text" || typeof item.text !== "string") {
        return { error: editorError("block.split.unsupported", "Split position must target editable text.", block.id) };
      }
      var text = item.text;
      var textOffset = validOffset(payload.position.offset, text.length);
      if (textOffset === null) return { error: editorError("block.split.unsupported", "Split position is outside editable text.", block.id) };
      var leftItem = Object.assign({}, item, { text: text.slice(0, textOffset) });
      var rightItem = Object.assign({}, item, { text: text.slice(textOffset) });
      var leftData = Object.assign({}, block.data, { text: items.slice(0, index).concat([leftItem]) });
      var rightData = Object.assign({}, block.data, { text: [rightItem].concat(items.slice(index + 1)) });
      return { blocks: [Object.assign({}, block, { data: leftData }), Object.assign({}, block, { id: block.id + "-split", data: rightData })] };
    }
    if (payload.position) return { error: editorError("block.split.unsupported", "Split position is not supported for this block.", block.id) };
    return { blocks: [Object.assign({}, block, { data: clone(block.data) }), Object.assign({}, block, { id: block.id + "-split", data: clone(block.data) })] };
  }

  function handlePaste(event, registry) {
    registry = registry || createDefaultBlockRegistry();
    var blocks = [];
    var chain = Promise.resolve();
    registry.list().forEach(function (tool) {
      if (tool.kind !== "block" || !tool.onPaste) return;
      chain = chain.then(function () {
        return Promise.resolve(tool.onPaste(event)).then(function (data) {
          blocks.push({ id: createId("paste-" + tool.type), type: tool.type, data: asRecord(data) });
        });
      });
    });
    return chain.then(function () {
      return blocks.length ? blocks : [createBlock("paragraph", { text: [{ type: "text", text: String(event && event.data || "") }] })];
    });
  }

  function changed(document) {
    return { document: clone(document), changed: true, errors: [] };
  }

  function failed(document, code, message, blockId) {
    return { document: document, changed: false, errors: [editorError(code, message, blockId)] };
  }

  function editorError(code, message, blockId, path) {
    return Object.assign({ code: code, message: message }, blockId ? { blockId: blockId } : {}, path ? { path: path } : {});
  }

  function isEditorCommand(value) {
    return value && typeof value === "object" && !Array.isArray(value) && typeof value.type === "string" && "payload" in value;
  }

  function isKnownCommand(type) {
    return Boolean(mutableCommands[type]) || type === "set-selection" || type === "save" || type === "request-publish";
  }

  function normalizeInlineContent(value) {
    if (!Array.isArray(value)) return [];
    return value.reduce(function (items, item) {
      if (!item || typeof item !== "object") return items;
      if (item.type === "hard-break") {
        items.push({ type: "hard-break" });
        return items;
      }
      if (item.type === "text") {
        var text = { type: "text", text: typeof item.text === "string" ? item.text : "" };
        var marks = normalizeMarks(item.marks);
        if (marks) text.marks = marks;
        items.push(text);
      }
      return items;
    }, []);
  }

  function sanitizeInlineContent(value) {
    return mergeAdjacentText(normalizeInlineContent(value).map(function (item) {
      if (item.type === "hard-break") return item;
      var marks = (item.marks || []).filter(function (mark) { return mark.type !== "link" || isSafeHref(mark.href); });
      return marks.length ? Object.assign({}, item, { marks: marks }) : { type: "text", text: item.text };
    }));
  }

  function validateInlineContent(value) {
    if (!Array.isArray(value)) return false;
    return value.every(function (item) {
      if (!item || typeof item !== "object") return false;
      if (item.type === "hard-break") return true;
      if (item.type !== "text" || typeof item.text !== "string") return false;
      return item.marks === undefined || (Array.isArray(item.marks) && item.marks.every(isInlineMark));
    });
  }

  function normalizeMarks(value) {
    if (!Array.isArray(value)) return undefined;
    var marks = value.filter(isInlineMark).map(function (mark) {
      return mark.type === "link" ? Object.assign({ type: "link", href: mark.href }, mark.title === undefined ? {} : { title: mark.title }) : { type: mark.type };
    });
    return marks.length ? marks : undefined;
  }

  function isInlineMark(value) {
    if (!value || typeof value !== "object" || typeof value.type !== "string") return false;
    if (value.type === "bold" || value.type === "italic" || value.type === "code" || value.type === "strike") return true;
    return value.type === "link" && typeof value.href === "string" && (value.title === undefined || typeof value.title === "string");
  }

  function isSafeHref(href) {
    return /^(https?:|mailto:|tel:|\/|#)/i.test(href);
  }

  function mergeAdjacentText(content) {
    return content.reduce(function (merged, item) {
      var previous = merged[merged.length - 1];
      if (previous && previous.type === "text" && item.type === "text" && JSON.stringify(previous.marks || []) === JSON.stringify(item.marks || [])) {
        previous.text += item.text;
      } else {
        merged.push(item);
      }
      return merged;
    }, []);
  }

  function mergeInlineText(left, right) {
    return { text: sanitizeInlineContent(asRecord(left).text).concat(sanitizeInlineContent(asRecord(right).text)) };
  }

  function mergeInlineTextWithLevel(left, right) {
    return { level: normalizeLevel(asRecord(left).level), text: sanitizeInlineContent(asRecord(left).text).concat(sanitizeInlineContent(asRecord(right).text)) };
  }

  function normalizeLevel(value) {
    return isLevel(value) ? value : 2;
  }

  function isLevel(value) {
    return value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6;
  }

  function normalizeListStyle(value) {
    return isListStyle(value) ? value : "unordered";
  }

  function isListStyle(value) {
    return value === "unordered" || value === "ordered" || value === "checklist";
  }

  function normalizeListItems(value) {
    if (!Array.isArray(value)) return [];
    return value.reduce(function (items, item) {
      if (!item || typeof item !== "object") return items;
      var listItem = { content: sanitizeInlineContent(item.content) };
      if (typeof item.checked === "boolean") listItem.checked = item.checked;
      items.push(listItem);
      return items;
    }, []);
  }

  function stableId(type, data) {
    var encoded = JSON.stringify({ type: type, data: data });
    var hash = 0;
    for (var index = 0; index < encoded.length; index += 1) hash = ((hash << 5) - hash + encoded.charCodeAt(index)) | 0;
    return "block-" + Math.abs(hash);
  }

  function validOffset(value, length) {
    if (value === undefined) return length;
    if (typeof value !== "number" || !Number.isInteger(value)) return null;
    return value >= 0 && value <= length ? value : null;
  }

  window.AdlaireEditor = {
    HeadlessEditorController: HeadlessEditorController,
    ToolRegistry: ToolRegistry,
    BlockRegistry: BlockRegistry,
    EventBus: EventBus,
    History: History,
    applyCommand: applyCommand,
    createEditor: function (config) { return new HeadlessEditorController(config); },
    createEmptyDocument: createEmptyDocument,
    createBlock: createBlock,
    createDefaultBlockRegistry: createDefaultBlockRegistry,
    createDefaultInlineTools: createDefaultInlineTools,
    createDefaultToolRegistry: createDefaultToolRegistry,
    getFirstBlockPosition: getFirstBlockPosition,
    getLastBlockPosition: getLastBlockPosition,
    getNextBlockPosition: getNextBlockPosition,
    getPreviousBlockPosition: getPreviousBlockPosition,
    handlePaste: handlePaste,
    sanitizeBlock: sanitizeBlock,
    sanitizeDocument: sanitizeDocument,
    normalizeBlock: normalizeBlock,
    normalizeDocument: normalizeDocument,
    validateBlock: validateBlock,
    validateDocument: validateDocument,
    validateDocumentAsync: validateDocumentAsync
  };
})();

/* Adlaire-Design editor core */
(function () {
  "use strict";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createEmptyDocument(id, schemaVersion) {
    return { id: id || "document", schemaVersion: schemaVersion || "1.0.0", blocks: [] };
  }

  function createBlock(type, data, id) {
    return { id: id || type + "-" + Math.random().toString(36).slice(2, 10), type: type, data: data || {} };
  }

  function flattenBlocks(document) {
    var result = [];
    function visit(blocks) {
      (blocks || []).forEach(function (block) {
        result.push(block);
        if (block.children) visit(block.children);
      });
    }
    visit(document.blocks);
    return result;
  }

  function findBlock(document, blockId) {
    return flattenBlocks(document).filter(function (block) { return block.id === blockId; })[0] || null;
  }

  function normalizeDocument(document) {
    return {
      id: String((document && document.id) || "document"),
      schemaVersion: String((document && document.schemaVersion) || "1.0.0"),
      blocks: Array.isArray(document && document.blocks) ? document.blocks.map(normalizeBlock) : [],
      meta: document && document.meta ? clone(document.meta) : undefined
    };
  }

  function normalizeBlock(block) {
    var type = String((block && block.type) || "unsupported");
    var data = block && block.data && typeof block.data === "object" && !Array.isArray(block.data) ? clone(block.data) : {};
    var normalized = { id: String((block && block.id) || createBlock(type).id), type: type, data: data };
    if (block && Array.isArray(block.children)) normalized.children = block.children.map(normalizeBlock);
    if (block && block.meta) normalized.meta = clone(block.meta);
    return normalized;
  }

  function validateDocument(document) {
    if (!document || typeof document !== "object") return { valid: false, errors: [error("document.invalid", "Document must be an object.")], warnings: [] };
    if (!Array.isArray(document.blocks)) return { valid: false, errors: [error("document.blocks.invalid", "Document blocks must be an array.")], warnings: [] };
    var ids = {};
    var errors = [];
    var warnings = [];
    flattenBlocks(document).forEach(function (block) {
      if (ids[block.id]) errors.push(error("block.id.duplicate", "Duplicate block id '" + block.id + "'.", block.id));
      ids[block.id] = true;
      if (!block.id) errors.push(error("block.id.required", "Block id is required."));
      if (!block.type) errors.push(error("block.type.required", "Block type is required.", block.id));
      if (block.type === "unsupported") warnings.push(error("block.unsupported", "Unsupported block is preserved.", block.id));
    });
    return { valid: errors.length === 0, errors: errors, warnings: warnings };
  }

  function sanitizeDocument(document) {
    var next = normalizeDocument(document);
    next.blocks = next.blocks.map(sanitizeBlock);
    return next;
  }

  function sanitizeBlock(block) {
    var next = clone(block);
    sanitizeValue(next.data);
    if (next.children) next.children = next.children.map(sanitizeBlock);
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
        return !(mark && mark.type === "link" && typeof mark.href === "string" && !/^(https?:|mailto:|\/|#)/i.test(mark.href));
      });
      if (value.marks.length === 0) delete value.marks;
    }
    Object.keys(value).forEach(function (key) { sanitizeValue(value[key]); });
  }

  function normalizeSelection(document, selection) {
    if (!selection) return null;
    if (!findBlock(document, selection.anchor && selection.anchor.blockId)) return null;
    if (!findBlock(document, selection.focus && selection.focus.blockId)) return null;
    return clone(selection);
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

  function error(code, message, blockId) {
    var result = { code: code, message: message };
    if (blockId) result.blockId = blockId;
    return result;
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

  function HeadlessEditorController(config) {
    config = config || {};
    this.events = new EventBus();
    this.history = new History(config.historyLimit);
    this.readOnly = Boolean(config.readOnly);
    this.document = normalizeDocument(config.document || createEmptyDocument());
    this.selection = null;
    this.saveState = { dirty: false, saving: false };
  }

  HeadlessEditorController.prototype.getDocument = function () {
    return clone(this.document);
  };
  HeadlessEditorController.prototype.setDocument = function (document) {
    this.document = normalizeDocument(document);
    this.selection = normalizeSelection(this.document, this.selection);
    this.saveState = { dirty: false, saving: false };
    this.events.emit({ type: "document:changed", document: this.getDocument() });
  };
  HeadlessEditorController.prototype.canDispatch = function (command) {
    return !(this.readOnly && /^(insert-block|delete-block|move-block|update-block|split-block|merge-block|set-document-meta)$/.test(command && command.type));
  };
  HeadlessEditorController.prototype.dispatch = function (command) {
    if (!command || typeof command.type !== "string") return this.fail("command.invalid", "Command must be valid.");
    if (!this.canDispatch(command)) return this.fail("command.readOnly", "Command is not allowed in read-only mode.");
    if (command.type === "set-selection") return this.setSelection((command.payload || {}).selection);
    if (command.type === "save") return { document: this.getDocument(), selection: this.getSelection(), changed: false, request: this.save((command.payload || {}).context) };
    if (command.type === "request-publish") return { document: this.getDocument(), selection: this.getSelection(), changed: false, request: this.requestPublish((command.payload || {}).context) };
    var before = { document: this.getDocument(), selection: this.getSelection() };
    var result = applyCommand(this.document, command);
    if (!result.changed || result.errors.length) return { document: this.getDocument(), selection: this.getSelection(), changed: false, errors: result.errors };
    this.document = sanitizeDocument(normalizeDocument(result.document));
    this.saveState.dirty = true;
    this.history.push({ before: before, after: { document: this.getDocument(), selection: this.getSelection() }, commands: [command] });
    this.events.emit({ type: "document:changed", document: this.getDocument() });
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  };
  HeadlessEditorController.prototype.dispatchBatch = function (commands) {
    if (!Array.isArray(commands)) return this.fail("command.batch.invalid", "Batch payload must be an array.");
    var changed = false;
    for (var index = 0; index < commands.length; index += 1) {
      var result = this.dispatch(commands[index]);
      if (result.errors && result.errors.length) return result;
      changed = changed || result.changed;
    }
    return { document: this.getDocument(), selection: this.getSelection(), changed: changed };
  };
  HeadlessEditorController.prototype.getSelection = function () {
    return this.selection ? clone(this.selection) : null;
  };
  HeadlessEditorController.prototype.setSelection = function (selection) {
    var normalized = normalizeSelection(this.document, selection || null);
    if (selection && !normalized) return this.fail("selection.invalid", "Selection must reference valid document positions.");
    this.selection = normalized;
    this.events.emit({ type: "selection:changed", selection: this.getSelection() });
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  };
  HeadlessEditorController.prototype.undo = function () {
    var snapshot = this.history.undo({ document: this.getDocument(), selection: this.getSelection() });
    if (!snapshot) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    this.document = snapshot.before.document;
    this.selection = snapshot.before.selection;
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  };
  HeadlessEditorController.prototype.redo = function () {
    var snapshot = this.history.redo({ document: this.getDocument(), selection: this.getSelection() });
    if (!snapshot) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    this.document = snapshot.after.document;
    this.selection = snapshot.after.selection;
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  };
  HeadlessEditorController.prototype.save = function (context) {
    var request = { document: this.getDocument(), context: context || { reason: "manual" }, state: Object.assign({}, this.saveState, { lastRequestedAt: new Date().toISOString() }) };
    this.events.emit({ type: "save:requested", request: request });
    return request;
  };
  HeadlessEditorController.prototype.requestPublish = function (context) {
    var request = { document: this.getDocument(), context: context || { reason: "manual" }, validation: validateDocument(this.document) };
    this.events.emit({ type: "publish:requested", request: request });
    return request;
  };
  HeadlessEditorController.prototype.subscribe = function (listener) {
    return this.events.subscribe(listener);
  };
  HeadlessEditorController.prototype.destroy = function () {
    this.events.clear();
  };
  HeadlessEditorController.prototype.fail = function (code, message) {
    var failure = error(code, message);
    this.events.emit({ type: "error", error: failure });
    return { document: this.getDocument(), selection: this.getSelection(), changed: false, errors: [failure] };
  };

  function applyCommand(document, command) {
    var next = clone(document);
    var payload = command.payload || {};
    if (command.type === "insert-block") {
      if (!payload.block || !payload.block.id || !payload.block.type) return failed(document, "command.payload.invalid", "insert-block requires a block.");
      next.blocks.splice(typeof payload.index === "number" ? payload.index : next.blocks.length, 0, clone(payload.block));
      return changed(next);
    }
    if (command.type === "delete-block") {
      next.blocks = next.blocks.filter(function (block) { return block.id !== payload.blockId; });
      return changed(next);
    }
    if (command.type === "update-block") {
      var target = findBlock(next, payload.blockId);
      if (!target) return failed(document, "block.notFound", "Block was not found.");
      if (target.type === "unsupported") return failed(document, "block.unsupported.readOnly", "Unsupported block data is read-only.");
      target.data = Object.assign({}, target.data, payload.data || {});
      return changed(next);
    }
    if (command.type === "move-block") {
      var from = next.blocks.findIndex(function (block) { return block.id === payload.blockId; });
      if (from < 0) return failed(document, "block.notFound", "Block was not found.");
      var block = next.blocks.splice(from, 1)[0];
      next.blocks.splice(Math.max(0, Math.min(Number(payload.toIndex) || 0, next.blocks.length)), 0, block);
      return changed(next);
    }
    if (command.type === "split-block") {
      var source = findBlock(next, payload.blockId);
      if (!source) return failed(document, "block.notFound", "Block was not found.");
      var splitId = payload.blockId + "-split";
      if (findBlock(next, splitId)) return failed(document, "block.id.duplicate", "Split id already exists.");
      next.blocks.splice(next.blocks.indexOf(source) + 1, 0, Object.assign({}, clone(source), { id: splitId }));
      return changed(next);
    }
    if (command.type === "merge-block") {
      if (payload.sourceBlockId === payload.targetBlockId) return failed(document, "block.merge.sameBlock", "Cannot merge a block into itself.");
      next.blocks = next.blocks.filter(function (block) { return block.id !== payload.sourceBlockId; });
      return changed(next);
    }
    if (command.type === "set-document-meta") {
      next.meta = Object.assign({}, next.meta || {}, payload.meta || {});
      return changed(next);
    }
    return failed(document, "command.unknown", "Unknown command.");
  }

  function changed(document) {
    return { document: document, changed: true, errors: [] };
  }

  function failed(document, code, message) {
    return { document: document, changed: false, errors: [error(code, message)] };
  }

  window.AdlaireEditor = {
    HeadlessEditorController: HeadlessEditorController,
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
    sanitizeBlock: sanitizeBlock,
    sanitizeDocument: sanitizeDocument,
    normalizeDocument: normalizeDocument,
    validateDocument: validateDocument
  };

  function createDefaultBlockRegistry(tools) {
    return createDefaultToolRegistry((tools || []).filter(function (tool) { return tool.kind === "block"; }));
  }

  function createDefaultInlineTools() {
    return ["bold", "italic", "link", "code", "strike"].map(function (type) {
      return { type: type, kind: "inline" };
    });
  }

  function createDefaultToolRegistry(tools) {
    var registry = {};
    ["paragraph", "heading", "list", "quote", "code", "image", "file", "divider", "callout", "unsupported"].forEach(function (type) {
      registry[type] = { type: type, kind: "block" };
    });
    createDefaultInlineTools().forEach(function (tool) { registry[tool.type] = tool; });
    (tools || []).forEach(function (tool) { registry[tool.type] = tool; });
    return {
      get: function (type) { return registry[type]; },
      has: function (type) { return Boolean(registry[type]); },
      values: function () { return Object.keys(registry).map(function (type) { return registry[type]; }); }
    };
  }
})();

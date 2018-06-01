"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get('/', (req, res) => {
    res.send('Hello, this is the node-chat-backend API');
});
exports.rootController = router;
//# sourceMappingURL=root.controller.js.map
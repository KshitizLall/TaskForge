const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");

const {
  getAllDeletedItems,
  restoreItem,
  permanentlyDeleteItem,
  emptyTrash,
} = require("../controllers/trash");

// Route to get all deleted items (projects and tasks)
router.get("/", authenticateToken, getAllDeletedItems);

// Route to restore an item (project or task)
router.patch("/:itemType/:itemId/restore", authenticateToken, restoreItem);

// Route to permanently delete an item (project or task)
router.delete(
  "/:itemType/:itemId/permanent",
  authenticateToken,
  permanentlyDeleteItem
);

// Route to empty entire trash
router.delete("/empty", authenticateToken, emptyTrash);

module.exports = router;

const router = require("express").Router();

const { parseError } = require("../utils/parser");
const { isMoldOwner, isItemOwner, hasUser, userStatus } = require("../middlewears/quards");
const moldService = require("../services/moldService");
const uploadPicturesAndDrawings = require("../middlewears/savePictureAndDrawings");

// Get all
router.get("/mold", async (req, res) => {
  let catalog = [];
  try {
    catalog = await moldService.getAll();

    res.json(catalog);
  } catch (error) {
    const message = parseError(error);
    res.status(404).json({ message });
  }
})

// Create mold & item
router.post("/mold", hasUser(), async (req, res) => {
  try {
    const { createdItem, createdMold } = await moldService.createItemWithMold(req.body);

    createdMold["_itemId"] = createdItem._id;

    const mold = await moldService.assignItemId(createdMold._id, createdMold);
    const createdAccets = {
      createdItem,
      mold
    };

    res.json(createdAccets);
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ message });
  }
})

// Get details by item ID
router.get("/mold/:itemId", async (req, res) => {
  try {
    const result = await moldService.getOneByItemId(req.params.itemId);

    res.json(result[0]);
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ message });
  }
})

// Get details by mold ID
router.get("/molds/:moldId", async (req, res) => {
  try {
    const mold = await moldService.getOne(req.params.moldId);

    res.json(mold);
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ message });
  }
})

// Edit mold
router.put("/molds/:moldId", userStatus('mold'), async (req, res) => {
  try {
    const mold = await moldService.edit(req.params.moldId, req.body);

    res.json(mold);
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ message });
  }
})

// Delete mold
router.delete("/molds/:itemId", hasUser(), isItemOwner(), async (req, res) => {
  const itemId = req.params.itemId;
  
  try {
    const result = await moldService.getOneByItemId(itemId);
    const mold = result[0];
    const moldId = (mold._id).toString();

    await moldService.del(itemId, moldId);
    res.status(204).end();
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ message });
  }
})

// Search mold by item name, hot-runner maker or hot-runner serial number
router.post('/search', async (req, res) => {
  const { name, serialNumber, hotRunnerSer, hotRunnerMan  } = req.body;

  try {
    const result = await moldService.search(name, serialNumber, hotRunnerSer, hotRunnerMan );
  
    res.json(result);
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ message });
  }
})

// Save drawing
router.post('/upload',
  uploadPicturesAndDrawings.fields([{ name: 'moldDrawing', maxCount: 10 }]),
  async (req, res) => {
    try {
      const moldDrawings = req.files.moldDrawing?.map(x => x.path) || [];

      res.json({
        moldDrawings
      });

    } catch (error) {
      const message = parseError(error);
      res.status(444).json({ message });
    }
  }
);

module.exports = router;

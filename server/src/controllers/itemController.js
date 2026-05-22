const router = require("express").Router();

const { parseError } = require("../utils/parser");
const { userStatus } = require("../middlewears/quards");
const itemService = require("../services/itemService");
const uploadPicturesAndDrawings = require('../middlewears/savePictureAndDrawings');

// Get all
router.get("/catalog", async (req, res) => {
  let catalog = [];
  const filter = {};
  const sort = {};

  if (req.query.shape) {
    filter.shape = req.query.shape;
  }

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.sort) {
    const order = req.query.order === "desc" ? -1 : 1;
    sort[req.query.sort] = order;
  }
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    catalog = await itemService.getAllSorted(filter, sort, skip, limit);
    total = await itemService.countDocuments(filter);
    
    res.json({
      data: catalog,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    const message = parseError(error);
    res.status(404).json({ message });
  }
})

// Get details
router.get("/item/:itemId", async (req, res) => {
  try {
    const item = await itemService.getOne(req.params.itemId);
    
    res.json(item);
  } catch (error) {
    const message = parseError(error);
    res.status(400).render({ message });
  }
})

// Edit item
router.put("/item/:itemId", userStatus('item'), async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const item = await itemService.edit(itemId, req.body);
    
    res.json(item);
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ message });
  }
})

// Search item by name or shape
router.post('/search', async (req, res) => {
  const { name, shape } = req.body;

  try {
    const result = await itemService.search(name, shape);
  
    res.json(result);
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ message });
  }
})

// Save image and drawing
router.post('/upload',
  uploadPicturesAndDrawings.fields([
    { name: 'image', maxCount: 1 },
    { name: 'itemDrawing', maxCount: 10 },
    { name: 'tds', maxCount: 1}
  ]),
  async (req, res) => {
    try {
      const image = req.files.image?.[0]?.secure_url;

      const itemDrawings = req.files.itemDrawing?.map(x => x.scure_url) || [];

      const tds = req.files.tds?.[0]?.secure_url;

      res.json({
        image,
        itemDrawings,
        tds
      });

    } catch (error) {
      const message = parseError(error);

      res.status(444).json({ message });
    }
  }
);

module.exports = router;
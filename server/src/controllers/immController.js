const router = require('express').Router();

const { parseError } = require('../utils/parser');
const { hasUser, userStatus } = require("../middlewears/quards");
const immService = require('../services/immService');
const uploadPicturesAndDrawings = require("../middlewears/savePictureAndDrawings");

// Get IMMs
router.get('/catalog', async (req, res) => {
    let catalog = [];
    try {
        const sortField = req.query.sort || "label";
        const order = req.query.order === "desc" ? -1 : 1;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        catalog = await immService.getAllSorted(sortField, order, skip, limit);
        total = await immService.countDocuments();

        res.json({
            data: catalog,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    }
})

router.get('/catalog/all', async (req, res) => { 
    try {
        const sortField = req.query.sort || "label";
        const order = req.query.order === "desc" ? -1 : 1;

        const catalog = await immService.getAll(sortField, order);

        res.json(catalog);
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    }
})

// Get details
router.get('/imm/:id', async (req, res) => {
    try {
        const imm = await immService.getImmById(req.params.id);
        
        res.json(imm);
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    }
})

// Create IMM
router.post('/imm', hasUser(), async (req, res) => {
    const data = req.body;
    
    try {
        if(data) {
            const imm = await immService.createImm(data);
            
            res.json(imm);
        } else {
            throw new Error;
        }
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    }
})

// Edit IMM
router.put('/imm/:immId', userStatus('imm'), async (req, res) => {
    try {
        const imm = await immService.editImm(req.params.immId, req.body);

        res.json(imm);
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    }
})

// Search imm by brand, label, force, injection unit or type
router.post('/search', async (req, res) => {
  const { producer, label, force, injectionUnit, type } = req.body;

  try {
    const result = await immService.searchImm(producer, label, force, injectionUnit, type);
  
    res.json(result);
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ message });
  }
})

// Delete IMM
router.delete('/imm/:immId', userStatus('imm'), async (req, res) => {
    try {
        await immService.delImm(req.params.immId);
        res.status(204).end();
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    }
})

// Upload drawings
router.post('/upload',
    uploadPicturesAndDrawings.fields([{ name: 'immDrawing', maxCount: 10 }]),
    async (req, res) => {
        console.log(req.files);
        console.log(req.immDrawing);
        
        try {
        const immDrawings = req.files.immDrawing?.map(x => x.path) || [];

        res.json({
            immDrawings
        });

        } catch (error) {
        const message = parseError(error);

        res.status(444).json({ message });
        }
    }
)

module.exports = router;
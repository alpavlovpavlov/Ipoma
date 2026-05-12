const router = require('express').Router();

const { parseError } = require('./../utils/parser');
const { hasUser } = require("../middlewears/quards");
const optionService = require('./../services/optionService');
const immService = require('../services/immService');
const itemService = require('../services/itemService');

// Create an option
router.post('/:itemId', hasUser(), async (req, res) => {
    const itemId = req.params.itemId;
    const immId = req.body.imm;
    
    try {
        if (req.params.itemId && req.body) {
            const option = await optionService.createAnOption(req.body);
            
            await immService.addOptionToAnImm(immId, option._id);
            await itemService.addOptionToAnItem(itemId, option._id);
            
            res.json(option);
        } else {
            throw new Error;
        };
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    };
});

// Delete an option
router.delete('/:optionId', hasUser(), async (req, res) => {
    const optionId = req.params.optionId;
    const { itemId, immId } = req.body;
    
    try {
        await optionService.delOption(optionId);
        immService.deleteAnOption(immId, optionId);
        itemService.deleteAnOption(itemId, optionId);

        res.json({ "message": "Option deleted"});
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    };
});

module.exports = router;
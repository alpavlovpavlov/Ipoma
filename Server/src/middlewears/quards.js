const { parseError } = require("../utils/parser");
const itemService = require("../services/itemService");
const moldService = require("../services/moldService");
const immService = require("../services/immService");

function hasUser() {
  return (req, res, next) => {
    
    if (req.user) {
      return next();
    }
    res.status(401).json({ message: 'Please login'});
  };
};

function isItemOwner() {
  return async (req, res, next) => {
    const user = await req.user;
    const userId = user._id;

    try {
        const item = await itemService.getOne(req.params.itemId);
    
        if (userId?.toString() != item._ownerId._id) {
          throw new Error('Only the creator can modify it!');
        }
        next();
    } catch (error) {
        const message = parseError(error);
        res.status(400).json({ message });
    }
  };
};

function isMoldOwner() {
  return async (req, res, next) => {
    try {
      const user = await req.user;
      const userId = user._id;
      const mold = await moldService.getOne(req.params.moldId);
      
      console.log(userId?.toString(), mold._ownerId._id);
      
      if (userId?.toString() != mold._ownerId._id) {
        throw new Error('Only the creator can modify it!');
      }
      next();
    } catch (error) {
      const message = parseError(error);
      res.status(400).json({ message });
    }
  };
};

function userStatus(assed) { 
  return async (req, res, next) => {
    const assedTypes = {
      mold: 'moldId',
      item: 'itemId',
      imm: 'immId'
    }

    const assedId = assedTypes[assed];

    const serviceFunctions = {
      mold: moldService,
      item: itemService,
      imm: immService
    }

    try {
      const user = await req.user;
      const userId = user._id;
      const foundAssed = await serviceFunctions[assed].getOne(req.params[assedId]);
      
      const admin = user.role == 'admin' ? true : false;
      const owner = userId?.toString() == foundAssed._ownerId._id ? true : false;

      if (admin == true || owner == true) {
        next();
      } else {
        throw new Error('Only the creator or admin can modify it!');
      }

    } catch (error) {
      const message = parseError(error);
      res.status(400).json({ message });
    }
  }
}

function isGuest() {
  return (req, res, next) => {
    if (!req.user) {
      return next();
    }
    res.status(400).json({ message: 'You are already logged in' });
  };
};

module.exports = {
  isItemOwner,
  isMoldOwner,
  userStatus,
  hasUser,
  isGuest,
};

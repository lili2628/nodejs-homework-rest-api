const Contact = require('../models/contact');
const { HttpError, ctrlWrapper } = require('../helpers');

const listContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite = null } = req.query;
    const skip = (page - 1) * limit; 
    let result = {}; 
   
    if (!favorite) {
        result = await Contact.find({owner}, "", {skip, limit}).populate("owner", "email subscription");
    } else {
      result = await Contact.find({ owner, favorite }, "", { skip, limit, favorite }).populate("owner", "email subscription");
    };
  
    res.status(200).json(result);
}

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);

    if (!result) {
      throw HttpError(404, "Not found");
    };
  
    res.status(200).json(result);
}

const addContact = async (req, res) => {
    const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });

    res.status(201).json(result);
}

const removeContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
 
    if (!result) {
      throw HttpError(404, "Not found");
    }
  
    res.status(200).json({
      "message": "contact deleted"
    });
}

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  
    if (!result) {
      throw HttpError(404, "Not found");
    }
  
    res.status(200).json(result);
}

const updateStatusContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  
    if (!result) {
      throw HttpError(404, "Not found");
    }
  
    res.status(200).json(result);
}


module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    removeContact: ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
}



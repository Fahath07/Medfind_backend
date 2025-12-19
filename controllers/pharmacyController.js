const Pharmacy = require('../models/Pharmacy');
const User = require('../models/User');

const createPharmacy = async (req, res) => {
  try {
    const { name, email, phone, address, location, ownerName, password } = req.body;

    // Create pharmacy owner user
    const user = await User.create({
      name: ownerName,
      email,
      password,
      role: 'pharmacy'
    });

    // Create pharmacy
    const pharmacy = await Pharmacy.create({
      name,
      email,
      phone,
      address,
      location,
      owner: user._id
    });

    res.status(201).json({
      success: true,
      pharmacy: {
        id: pharmacy._id,
        name: pharmacy.name,
        email: pharmacy.email,
        phone: pharmacy.phone,
        address: pharmacy.address,
        location: pharmacy.location
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ isActive: true })
      .populate('owner', 'name email')
      .select('-__v');

    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id)
      .populate('owner', 'name email');

    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    res.json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );

    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    res.json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPharmacy,
  getPharmacies,
  getPharmacy,
  updatePharmacy
};
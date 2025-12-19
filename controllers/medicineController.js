const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');

const searchMedicines = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ message: 'Medicine name is required' });
    }

    const medicines = await Medicine.find({
      name: { $regex: name, $options: 'i' }
    }).populate('pharmacy', 'name location phone address');

    const groupedResults = {};
    
    medicines.forEach(medicine => {
      if (!groupedResults[medicine.name]) {
        groupedResults[medicine.name] = {
          _id: medicine._id,
          name: medicine.name,
          category: medicine.category,
          pharmacies: []
        };
      }
      
      groupedResults[medicine.name].pharmacies.push({
        pharmacyName: medicine.pharmacy.name,
        location: medicine.pharmacy.location,
        phone: medicine.pharmacy.phone,
        address: medicine.pharmacy.address,
        price: medicine.price,
        available: medicine.quantity > 0,
        quantity: medicine.quantity
      });
    });

    const results = Object.values(groupedResults);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMedicines = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const medicines = await Medicine.find({ pharmacy: pharmacy._id });
    const formattedMedicines = medicines.map(med => ({
      id: med._id,
      name: med.name,
      sku: med.sku,
      price: med.price,
      quantity: med.quantity,
      category: med.category
    }));
    
    res.json(formattedMedicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMedicine = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Medicine name is required' });
    }

    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const medicine = await Medicine.create({
      ...req.body,
      pharmacy: pharmacy._id
    });

    res.status(201).json({
      id: medicine._id,
      name: medicine.name,
      sku: medicine.sku,
      price: medicine.price,
      quantity: medicine.quantity,
      category: medicine.category
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, pharmacy: pharmacy._id },
      req.body,
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({
      id: medicine._id,
      name: medicine.name,
      sku: medicine.sku,
      price: medicine.price,
      quantity: medicine.quantity,
      category: medicine.category
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      pharmacy: pharmacy._id
    });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchMedicines,
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine
};
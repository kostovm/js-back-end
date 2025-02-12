const Animal = require('../models/Animal');
const {extractErrorMsgs} = require('../utils/errorHandler');

exports.create = (animalData) => Animal.create(animalData);

exports.getAll = () => Animal.find();

exports.singleAnimal = (animalId) => Animal.findById(animalId).populate('donations');

exports.update = (animalId, animalData) => Animal.findByIdAndUpdate(animalId, animalData, { runValidators: true });

exports.delete = (animalId) => Animal.findByIdAndDelete(animalId);

exports.search = async (search) => {
    let filterAnimals = await Animal.find().lean();

    if(search !== undefined){
        filterAnimals = filterAnimals.filter(animal => {
        return (
            animal.name.toLowerCase().includes(search.toLowerCase()) ||
            animal.age.toString().toLowerCase().includes(search.toLowerCase()) ||
            animal.kind.toLowerCase().includes(search.toLowerCase()) ||
            animal.need.toLowerCase().includes(search.toLowerCase()) ||
            animal.location.toLowerCase().includes(search.toLowerCase()) ||
            animal.description.toLowerCase().includes(search.toLowerCase())
        );
    });
    }

    return filterAnimals;
};

exports.donate = async (animalId, userId) => {
const animal = await this.singleAnimal(animalId);


    animal.donations.push(userId);
    return animal.save();
};
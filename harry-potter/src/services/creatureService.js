const Creature = require('../models/Creature');

exports.create = (creatureData) => Creature.create(creatureData);

exports.getAll = () => Creature.find();

exports.singleCreature = (creatureId) => Creature.findById(creatureId).populate('votes');

exports.update = (creatureId, creatureData) => Creature.findByIdAndUpdate(creatureId, creatureData, { runValidators: true });

exports.delete = (creatureId) => Creature.findByIdAndDelete(creatureId);

exports.getMyCreatures = (ownerId) => Creature.find({owner: ownerId}).populate('owner');

exports.addVotesToCreature = async (creatureId, userId) => {
    const creature = await this.singleCreature(creatureId);
    const isExistingInVotes = creature.votes.some((v) => v?.toString() === userId);
    
    if(isExistingInVotes){
        return
    }

    creature.votes.push(userId);
    return creature.save();
}
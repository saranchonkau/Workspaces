const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const WorkspaceSchema = mongoose.Schema({
        name: {type: String, required:true, unique: true},
        snapshot: String
    }
);

WorkspaceSchema.plugin(findOrCreate);

const Workspace = mongoose.model('Workspace', WorkspaceSchema, 'workspaces');

module.exports = Workspace;

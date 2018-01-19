const router = require('express').Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const utils = require('../utils');
const Workspace = require('../../models/workspace');

/* GET workspaces page. */
router.get('/',
    ensureLoggedIn(),
    function(req, res, next) {
        if(!utils.checkUserBlock(req, res)) {
            Workspace.find(function (err, workspaces) {
                res.render('workspaces', {workspaces: workspaces});
            });
        }
    });

/* GET workspace page. */
router.get('/:id',
    ensureLoggedIn(),
    function(req, res, next) {
        if(!utils.checkUserBlock(req, res)) {
            Workspace.findById(req.params.id, function (err, workspace){
                if(err){
                    console.error(err);
                } else {
                    if(workspace) {
                        console.log('Render new page with ID: ', workspace._id);
                        console.log('Workspace: ', workspace);
                        res.render('workspace', {workspace: workspace});
                    } else {
                        res.redirect('/workspaces');
                    }
                }
            });
        }
    });

router.get('/:id/snapshot',
    ensureLoggedIn(),
    function(req, res, next) {
        if(!utils.checkUserBlock(req, res)) {
            Workspace.findById(req.params.id, function (err, workspace){
                if(err){
                    console.error(err);
                } else {
                    if(workspace) {
                        console.log('Load snapshot: ', workspace.snapshot);
                        res.send(workspace.snapshot);
                    } else {
                        res.redirect('/workspaces');
                    }
                }
            });
        }
    });

router.post('/create',
    ensureLoggedIn(),
    function(req, res, next) {
        if(!utils.checkUserBlock(req, res)) {
            let name = req.body.workspaceName;
            if(name === ''){
                res.send('Please, enter workspace name !');
            } else {
                let workspace = new Workspace({
                    name: name
                });
                console.log('Name: ', workspace.name);
                workspace.save(function(err, product, numAffected) {
                    if (product){
                        res.send(product);
                    } else {
                        res.send('Workspace with such name already exists !');
                    }
                });

            }
        }
    });

router.delete('/delete',
    ensureLoggedIn(),
    function(req, res) {
        if(!utils.checkUserBlock(req, res)) {
            Workspace.findByIdAndRemove(req.body.workspaceID, function (doc) {
                if (!doc){
                    console.log('Workspace with ID: ' + req.body.workspaceID + ' was removed');
                    res.send(true);
                } else {
                    console.log("Workspace with ID: " + req.body.workspaceID + " wasn't removed");
                    res.send(false);
                }
            });
        }
    });

module.exports = router;

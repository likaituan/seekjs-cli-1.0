#!/usr/bin/env node

(function(req, exp) {
    var fs = require("fs");
    var path = require("path");
    var cp = require("child_process");
    var pk = require("../package.json");
    var isLinuxLike = require("os").type() != "window";
    var prefix = isLinuxLike ? "sudo " : "";

    var args = {};
    var argv = process.argv.slice(2);
    var cmd = argv.shift();
    var skPath = path.join(__dirname, "..");
    //console.log("skPath=", skPath);
    var viewName;

    //新建seek项目
    exp.create = function(){
        var project = argv[0];
        if(project) {
            var type = args.type || "base";
            cp.execSync(`${skPath}/bin/create.sh '${skPath}/assets/${type}' '${project}'`);
            console.log("good, project create success!");
            args.open && cp.execSync(`open ${project}/index.html`);
        }else{
            console.log("please enter your project name before!");
        }
    };

    //build项目
    exp.build = function(){
        //try{
            var file = path.resolve("./seek.config");
            var cfg = req(file);
            var gen = req("../build/gen");
            args.isCompress = !args.mo;
            gen.init(cfg, args);/*
        }catch(e){
            console.log(e);
            console.log(e.stacks);
            console.log("please add 'seek.config.js' before!")
        }*/
    };


    //更新脚手架
    exp.up = exp.update = function(){
        console.log("now is updating, please wait a moment...");
        cp.exec(`${prefix}npm update -g seek-cli`, function callback(error, stdout, stderr) {
            console.log(stdout);
        });
    };

    //重新安装脚手架
    exp.install = function(){
        console.log("now is reinstalling, please wait a moment...");
        cp.exec(`${prefix}npm install -g seek-cli`, function callback(error, stdout, stderr) {
            console.log(stdout);
        });
    };

    //增加view
    exp.addview = function(){
        viewName = args.shift();
        var by = args.shift();
        if (by == "by") {
            var refView = args.shift();
            cp.execSync(`cp './js/${refView}.js' './js/${viewName}.js'`);
            cp.execSync(`cp './css/${refView}.css' './css/${viewName}.css'`);
            cp.execSync(`cp './templates/${refView}.html' './templates/${viewName}.html'`);
        } else {
            cp.execSync(`touch './js/${viewName}.js'`);
            cp.execSync(`touch './css/${viewName}.css'`);
            cp.execSync(`touch './templates/${viewName}.html'`);
        }
        console.log(`add view ${viewName} success!`);
    };

    //view改名
    exp.renameview = function(){
        viewName = argv.shift();
        var to = argv.shift();
        if (to) {
            var newName = argv.shift();
            cp.execSync(`mv './js/${viewName}.js' './js/${newName}.js'`);
            /*fs.ex  */cp.execSync(`mv './css/${viewName}.css' './css/${newName}.css'`);
            cp.execSync(`mv './templates/${viewName}.html' './templates/${newName}.html'`);

            console.log("rename view ${viewName} to ${newName} success!");
        } else {
            console.log("please set a new view name");
        }
    };

    //删除view
    exp.delview = function(){
        viewName = args.shift();
        cp.execSync(`rm './js/${viewName}.js'`);
        cp.execSync(`rm './css/${viewName}.css'`);
        cp.execSync(`rm './templates/${viewName}.html'`);
        console.log(`delete view ${viewName} success!`);
    };

    //查看seekjs版本
    exp["-v"] = function() {
        console.log(pk.version);
    };


    if(cmd){
        cmd = cmd.toLowerCase();

        argv.forEach(function (kv) {
            kv = kv.split("=");
            var k = kv[0];
            var v = kv[1];
            if (kv.length == 2) {
                args[k] = v;
            } else {
                args[k] = true;
            }
        });

        if(exp[cmd]){
            exp[cmd]();
        } else {
            console.log(`sorry, no such command '${cmd}'!`);
        }
    } else {
        console.log(`welcome to use seekjs,\n seekjs current version is ${pk.version}!`);
    }

})(require, exports);
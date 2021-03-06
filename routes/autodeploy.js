var fs = require('fs');

//var db_master = "cldstkdbsrv01";
//var db_slave = "cldstkdbsrv02";
//var kvm_hosts = "cldstkkvm01,cldstkkvm02";
//var web_hosts = "cldstkwebsrv01,cldstkwebsrv02";

exports.start = function(req, res){
    var db_master = req.body.db_master.toString().replace(',',''),
        db_slave = req.body.db_slave.toString().replace(',',''),
        kvm_hosts = req.body.kvm_hosts,
        web_hosts = req.body.web_hosts,
        nfs_server = req.body.nfs_server.toString().replace(',',''),
        nfs_path = req.body.nfs_path.toString().replace(',',''),
        repo_type = req.body.repo_type.toString().replace(',',''),
        repo_version = req.body.repo_version.toString().replace(',','')

    var cldstk_kvm = "";

    for (var i in kvm_hosts.split(",")) {
    	//console.log(kvm_hosts.split(",")[i]);
    	cldstk_kvm = cldstk_kvm + kvm_hosts.split(",")[i] + "\n";
    };
    //console.log(cldstk_kvm);
    
    var cldstk_web = "";
    var cldstk_mgmt = "";

    cldstk_mgmt = web_hosts.split(",")[0];

    for (var i in web_hosts.split(",")) {
    	cldstk_web = cldstk_web + web_hosts.split(",")[i] + "\n";
    };
    console.log(cldstk_web);

    var hostfiledata = "[localhost]\n127.0.0.1\n\n" +
                    "[db_master]\n" + db_master + "\n\n[db_slave]\n" + db_slave +
    				"\n\n[cldstk_web]\n" + cldstk_web + "\n[cldstk_kvm]\n" +
    				cldstk_kvm + "\n[mysql_servers]\n" + db_slave + "\n" + db_master + "\n" +
                    "\n[cldstk_mgmt]\n" + cldstk_mgmt + "\n";


    fs.writeFile("./ansible/hosts", hostfiledata, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The host file was saved!");
        }
    }); 

    var varsfiledata = "---\n" + 
                   "master: " + db_master + "\n" +
    			   "slave: " + db_slave + "\n" +
    				"cloud_repl_password: password" + "\n" +
    				"mysql_root_password: PaSSw0rd1234" + "\n" +
                    "nfs_server: " + nfs_server + "\n" +
                    "nfs_path: " + nfs_path + "\n" + 
                    "repotype: " + repo_type + "\n" + 
                    "repoversion: " + repo_version + "\n";


    fs.writeFile("./ansible/vars_file.yml", varsfiledata, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The vars file was saved!");
        }
    });
    //res.write("Finished Successfully....")
    setTimeout(function() { 
        res.redirect('/');
        res.end();
    }, 5000);
    
    console.log("The end!");
    //res.send({success:"success"});
    //res.end();
    //res.render('autodeploy', { title: 'CloudStack Auto Deploy' });
};


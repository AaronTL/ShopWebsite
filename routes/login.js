md5 = require('js-md5');
module.exports = function ( app ) {
    app.get('/login',function(req,res){
        res.render('login');
    });

    app.post('/login', function (req, res) {
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname;
        User.findOne({name: uname}, function (error, doc) {
            if (error) {
                res.send(500);
                console.log(error);
            } else if (!doc) {
                req.session.error = 'User name does not exist ！';
                res.send(404);
            } else {
               /*var hash = 0, i, chr, len;
               for (i = 0, len = req.body.upwd.length; i < len; i++) {
                 chr   = req.body.upwd.charCodeAt(i);
                 hash  = ((hash << 5) - hash) + chr;
                 hash |= 0; // Convert to 32bit integer
               }*/
                console.log(md5(req.body.upwd));
               if(md5(req.body.upwd) != doc.password){
                   req.session.error = "Wrong password!";
                   res.send(404);
               }else{
                   req.session.user=doc;
                   res.send(200);
               }
            }
        });
    });

}
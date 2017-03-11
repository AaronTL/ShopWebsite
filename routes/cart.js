module.exports = function ( app ) {
    //View shopping cart merchandise
    app.get('/cart', function(req, res) {
        var Cart = global.dbHelper.getModel('cart');
        if(!req.session.user){
            req.session.error = "Expired, please login again:"
            res.redirect('/login');
        }else{
            Cart.find({"uId":req.session.user._id,"cStatus":false}, function (error, docs) {
                res.render('cart',{carts:docs});
            });
        }
    });
    //Add shopping cart product
    app.get("/addToCart/:id", function(req, res) {
       //req.params.id ;Get commodity ID number
        if(!req.session.user){
            req.session.error = "Expired, please login again:";
            res.redirect('/login');
        }else{
            var Commodity = global.dbHelper.getModel('commodity'),
                Cart = global.dbHelper.getModel('cart');
            Cart.findOne({"uId":req.session.user._id, "cId":req.params.id},function(error,doc){
                //Commodity already exists  +1
                if(doc){
                    Cart.update({"uId":req.session.user._id, "cId":req.params.id},{$set : { cQuantity : doc.cQuantity + 1 }},function(error,doc){
                        //Successful return 1 failed to return 0
                        if(doc > 0){
                            res.redirect('/home');
                        }
                    });
                //Merchandise not present, add new one
                }else{
                    Commodity.findOne({"_id": req.params.id}, function (error, doc) {
                        if (doc) {
                            Cart.create({
                                uId: req.session.user._id,
                                cId: req.params.id,
                                cName: doc.name,
                                cPrice: doc.price,
                                cImgSrc: doc.imgSrc,
                                cQuantity : 1
                            },function(error,doc){
                                if(doc){
                                    res.redirect('/home');
                                }
                            });
                        } else {

                        }
                    });
                }
            });
        }
    });

    //Delete shopping cart product
    app.get("/delFromCart/:id", function(req, res) {
        //req.params.id 获取商品ID号
        var Cart = global.dbHelper.getModel('cart');
        Cart.remove({"_id":req.params.id},function(error,doc){
            //成功返回1  失败返回0
            if(doc > 0){
                res.redirect('/cart');
            }
        });
    });

    //购物车结算
    app.post("/cart/clearing",function(req,res){
        var Cart = global.dbHelper.getModel('cart');
        Cart.update({"_id":req.body.cid},{$set : { cQuantity : req.body.cnum,cStatus:true }},function(error,doc){
            //更新成功返回1  失败返回0
            if(doc > 0){
                res.send(200);
            }
        });
    });


}


/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

        startApp();
        //////////////////////////////////////////////
        // navigator.splashscreen.show();
        // setTimeout(function() {
        //     navigator.splashscreen.hide();

        // }, 3000); 

        document.addEventListener("online", onOnline, false);
        document.addEventListener("offline", onOffline, false);

        function onOnline() {
            myApp.hideIndicator();
            // mainView.router.back();
            myApp.closeModal('#noConn', true);
        }



        function onOffline() {
            myApp.closeModal();
            myApp.loginScreen('#noConn');
            //mainView.router.loadPage("./noConn.html");
        }
        /////////////////////////////////////////////

    }
};

app.initialize();



// /////////////////////////////////////////////////////////////////////////////////////

// My Code - Start

// /////////////////////////////////////////////////////////////////////////////////////

function startApp(argument) {
    storage = window.localStorage;
    storage.setItem('orders', "[]");
    mainProductsArray = [];
    mainOrdersArray = [];
    reqArrayCate = [];
    preparedOrdersArray = [];



    if (!storage.getItem('favLocations')) {
        storage.setItem('favLocations', '[]');
    }


    // Initialize app
    myApp = new Framework7({
        swipeBackPage: false,
        imagesLazyLoadThreshold: 50,
        swipePanel: 'left',
        swipePanelActiveArea: '30',
        modalTitle: 'SMARTCART'
        // material: true
    });

    // If we need to use custom DOM library, let's save it to $$ variable:
    $$ = Dom7;

    // Add view
    mainView = myApp.addView('.view-main', {
        // Because we want to use dynamic navbar, we need to enable it for this view:
        dynamicNavbar: true,
        domCache: true
    });

    ///////////////////////////////

    //Back Button 

    /////////////////////////////

    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown() {
        // alert(myApp.getCurrentView().activePage.fromPage.name);
        // if(myApp.getCurrentView().activePage.fromPage.name=="index"){
        //  window.plugins.appMinimize.minimize();
        // }
        var pageName = myApp.getCurrentView().activePage.name;
        if (pageName != 'index') {
            myApp.hideIndicator();
            mainView.router.back();
        }

    }



    // /////////////////////////////////////////////////////////////////////////////////////

    // My Code - End

    // ////////////////////////////////////////////////////////////////////////////////////

    // /////////////////////////////////////////////////////////////////////////////////////

    // My Template - Start

    // ////////////////////////////////////////////////////////////////////////////////////

    function createCard(item, elementID, qun) {

        var id = item.id;
        var image = item.images["0"].src;
        var title = item.name;

        var price = item.price;
        var teaser = 1;


        var temp = '<div id="productCard" card_id="card_' + id + '" class="card-panel lighten-5 z-depth-1" style="padding: 4px;">' +
            '<div class="row valign-wrapper" style="margin: 0;">' +
            '<div class="col s8">' +
            '<div class="row valign-wrapper _productTitle right-align" style="font-size: 20px;margin-top: 10px;">' + title + '</div>' +
            '<div class="row valign-wrapper _productPrice right-align " style="font-size: 15px;color: green;">' + price + ' JD</div>' +
            '<div class="row _productQun " style="margin: 0px;height: 60px;">' +
            '<div onclick="minus(' + id + ')" class="col s3 center"><i class="material-icons PlusMinus">remove_circle_outline</i></div>' +
            '<div class="col s3 center valign-wrapper"><input type="number" value="' + qun + '" qun_id="qun_' + id + '" name="qun_' + id + '" data-id="' + id + '" data-price="' + price + '"  style="height: 53px;font-size: 38px;width: 50px;"/></div>' +
            '<div onclick="plus(' + id + ')" class="col s3 center"><i class="material-icons PlusMinus">add_circle_outline</i></div>' +
            '<div class="col s3 center"></div>' +
            '</div>' +
            '</div>' +
            '<div class="col s4">' +
            '<img src="' + image + '" alt="" class="responsive-img">' +
            '</div>' +
            '</div>' +
            '</div>';

        $("#" + elementID).append(temp);
    }



    function createMyOrderList(index, value) {
        param = $$.serializeObject(value);
        var temp = '<li>' +
            '<a href="./orderDetails.html?' + param + '" class="item-link item-content">' +
            '<div class="item-media"></div>' +
            '<div class="item-inner">' +
            '<div class="item-title-row">' +
            '<div class="item-title"><h3>ID: <span>' + value.id + '</span></h3></div>' +
            '<div class="item-after"></div>' +
            '</div>' +
            '<div class="item-subtitle">Create Date:</div>' +
            '<div class="item-text"><span>' + value.date_created + '</span></div>' +
            '</div>' +
            '</a>' +
            '</li>';

        $('#myOrderList').append(temp);
    }

    function createMyOrderDetails(item, counter) {
        var temp = '<li>' +
            '<a href="#" class=" item-content">' +
            '<div class="item-media"></div>' +
            '<div class="item-inner">' +
            '<div class="item-title-row">' +
            '<div class="item-title"><h5>Product #: ' + (counter + 1) + '</h5></div>' +
            '<div class="item-after"></div>' +
            '</div>' +
            '<div class="item-subtitle"></div>' +
            '<div class="">Name: ' + item.query["line_items[" + counter + "][name]"] + '<br>Quantity: ' + item.query["line_items[" + counter + "][quantity]"] + '<br>Unit Price: ' + item.query["line_items[" + counter + "][price]"] + '</div>' +
            '</div>' +
            '</a>' +
            '</li>';

        $('#OrderDetailsList').append(temp);
    }

    function favLocationsList(locationName) {
        var temp = '<ul>' +
            '<li class="item-content">' +
            '<div class="item-media"><i class="material-icons">place</i></div>' +
            '<div class="item-inner">' +
            '<div class="item-title">' + locationName + '</div>' +
            '<div class="item-after"><i onClick="deleteFavLocation()" class="material-icons">delete</i></div>' +
            '</div>' +
            '</li>' +
            '</ul>';

        $('#favLocationsList').append(temp);
    }

    function createCategoriesGridList(data) {
        var temp = '<div class="col s6">' +
            '<div class="card " height="0px">' +
            '<div class="card-image">' +
            '<a href="#" onClick="openProductPageForCat(' + data.id + ')"><img src="' + data.image.src + '" class="responsive-img">' +
            '<span class="card-title col s12"  style="background-color:rgba(66,66,66,0.6);font-size:20px">' + data.name + '</span></a>' +
            '</div>' +
            '</div>' +
            '</div>';

        $('#productCategories').append(temp);
    }


    // /////////////////////////////////////////////////////////////////////////////////////

    // My Template - End

    // ///////////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////


    // Functions

    //////////////////////////////////////////////////////

    function listLoop(element) {
        var a = element[0].children;
        createGallary(a);
    }

    totalPrice = function(arg) {
        var total = 0;

        mainProductsArray.forEach(function(element) {
            if (element.qun != 0) {
                total = total + (element.qun * element.price);
            }
        });

        ////// var orders = storage.getItem('orders');
        ////// var ordersAsArray = eval(orders);
        ////// for (var i = 0; i < ordersAsArray.length; i++) {
        //////     var l = ordersAsArray[i];
        //////     total = total + (parseInt(l[2]) * parseInt(l[1]));

        $("#totalPrice").html(total);
        storage.setItem('totalPrice', total);
    }

    minus = function(arg) {
        var pageName = myApp.getCurrentView().activePage.name;
        if ($("input[qun_id='qun_" + arg + "']").val() != 0) {
            $("input[qun_id='qun_" + arg + "']").val(parseInt($("input[qun_id='qun_" + arg + "']").val()) - 1);
            mainProductsArray = mainProductsArray.map(function(element) {
                if (element.id == arg) {
                    element.qun--;
                    return element;
                } else {
                    return element;
                }
            });
            console.log(mainProductsArray);
            totalPrice();
            ////// eachOrder(2);
        }
        if (pageName == 'cart' && $("input[qun_id='qun_" + arg + "']").val() == 0) {
            $($("div[data-page='cart']")[1]).find("div[card_id='card_" + arg + "']").remove();
            ////// eachOrder(2);
        }
    }

    plus = function(arg) {
        //// var pageName = myApp.getCurrentView().activePage.name;
        if ($("input[qun_id='qun_" + arg + "']").val() <= 99) {
            $("input[qun_id='qun_" + arg + "']").val(parseInt($("input[qun_id='qun_" + arg + "']").val()) + 1);

            if (!mainOrdersArray.includes(arg)) {
                mainOrdersArray.push(arg);
            }

            mainProductsArray = mainProductsArray.map(function(element) {
                if (element.id == arg) {
                    element.qun++;
                    return element;
                } else {
                    return element;
                }
            });
            totalPrice();
            console.log(mainProductsArray);
            console.log(mainOrdersArray);
            ////// eachOrder(2);
        }
    }

    eachOrder = function(flag) {
        // var pageName = myApp.getCurrentView().activePage.name;
        // // if flag=1 then checkout if flag=0 go to cart page
        // var length = $($("div[data-page='" + pageName + "']")[1]).find("input[name^='qun_']").length;
        // var orderArray = [];
        // var productArray = $($("div[data-page='" + pageName + "']")[1]).find("input[name^='qun_']");
        // for (var i = 0; i < length; i++) {
        //     var product = productArray[i];
        //     if ($(product).val() != 0) {
        //         orderArray.push([$$(product).data('id'), $$(product).val(), $$(product).data('price')]);
        //     }

        // }
        // var orderString = JSON.stringify(orderArray);
        if (flag == 4) {
            mainView.router.loadPage("./cart.html");
        }
        if (flag == 2) {
            ////// storage.setItem('orders', orderString);
        }
        if (flag == 1) {
            sendOrder(orderString);
        }
        if (flag == 0) {
            ////// storage.setItem('orders', orderString);
            mainView.router.loadPage("./cart.html");
        }
        totalPrice();
    }
    sendOrder = function(arg) {

        myApp.showIndicator();
        $$.post("http://63.142.251.169/sb/restapi/placeOrder.php", arg, function(data) {
            myApp.hideIndicator();
        });

    }

    loginCheck = function(arg) {
        var formData = myApp.formToData('#loginForm');
        myApp.showIndicator();
        $$.post("http://63.142.251.169/sb/restapi/login.php", formData, function(data) {
            myApp.hideIndicator();
            if ($.parseJSON(data).id) {
                storage.setItem('userData', data);
                mainView.router.load("./index.html");
                myApp.closeModal();
            } else {
                myApp.alert("Your Password Or Student Number Is In Correct");
            }

        });

    }
    logout = function(arg) {
        myApp.closePanel();
        storage.removeItem('userData');
        myApp.loginScreen('#mainLogin');
    }

    checkCardExist = function(arg) {
        // var pageName=myApp.getCurrentView().activePage.name;
        if (arg == 'cart') {
            var exsit = $("#cartList").find("#productCard");
            console.log(exsit);
            if (exsit.length > 0) {
                return true;
            } else {
                return false;
            }
        }
    }



    checkout = function(argument) {
        
        if (mainOrdersArray.length>0) {
            showMapModel();
            // myApp.confirm('هل أنت متأكد من عمليت الشراء', 'SMARTCART',
            //     function() {
            //         var userData = storage.getItem('userData');
            //         var orders = storage.getItem('orders');
            //         var ordersAsArray = eval(orders);
            //         myApp.showIndicator();
            //         $.post("http://63.142.251.169/sb/restapi/placeOrder.php", { ordersAsArray, userData , orderLocation }, function(data) {
            //             myApp.hideIndicator();
            //             console.log();
            //             var dataAsJSON = $.parseJSON(data);
            //             myApp.alert("يرجى حفظ رقم الطلب لإستلام الطلبية  <h4>" + dataAsJSON.id + "</h4>");
            //         });
            //     },
            //     function() {
            //         // Click Cancel
            //     }
            // );

        } else {
            myApp.alert('لا يوجد مواد لاتمام عملية الشراء');
        }

    }


    signup = function(argument) {
        var formData = myApp.formToData('#signupForm');
        console.log("formData");
        console.log(formData);
        if (formData.email == "" || formData.name == "" || formData.password == "" || formData.phoneNumber == "" || formData.studentNumber == "") {
            myApp.alert('Please Fill All Form');
        } else {
            myApp.showIndicator();
            $.post('http://63.142.251.169/sb/restapi/createCustomer.php', formData, function(data, textStatus, xhr) {
                myApp.hideIndicator();
                console.log(data);
                if (data.startsWith("{")) {
                    $('#btnSignup').addClass('disabled');

                    storage.setItem('userData', data);
                    // var value = storage.getItem('a');
                    // console.log(value);

                    myApp.alert('User Created', 'Thank\'s For Register', function() {
                        myApp.closeModal('#signupForm');
                        myApp.closeModal('#mainLogin');
                        mainView.router.load("./index.html");

                    });


                } else {
                    var newData = data.replace("username", "Student Number");
                    myApp.alert(newData.slice(newData.indexOf("An account"), newData.indexOf(".")));
                }

            });
        }
        // var formDataJSON= JSON.stringify(formData);
        //console.log(formDataJSON);

    }

    openSignup = function(argument) {
        myApp.closeModal('#mainLogin');
        myApp.loginScreen('#signupForm', false);
    }


    about = function(argument) {
        mainView.router.loadPage("./about.html");
        myApp.closePanel();
    };

    home = function(argument) {
        // $( "div[data-page*='products']" )[1].remove();
        mainView.router.back({ pageName: 'index', force: true });
        myApp.closePanel();
    }

    shop = function(argument) {
        mainView.router.loadPage("./products.html");
        myApp.closePanel();
    }

    cart = function(argument) {
        mainView.router.loadPage("./cart.html");
        myApp.closePanel();
    }

    myOrder = function(argument) {
        myApp.closePanel();
        myApp.showIndicator();
        var userID = $.parseJSON(storage.getItem('userData')).id;
        $$.get("http://63.142.251.169/sb/restapi/myOrder.php", { userID: userID }, function(data) {
            myApp.hideIndicator();
            storage.setItem('myOrder', data);
            mainView.router.loadPage('./myOrder.html');
        });

    }

    backFromPanel = function(argument) {
        myApp.closeModal('#signupForm', false);
        myApp.loginScreen('#mainLogin', false);
    }

    prepareOrdersToSend = function(argument) {
        console.log(mainProductsArray);
        preparedOrdersArray = [];
        mainProductsArray.forEach(function(element) {
            if (element.qun > 0) {
                preparedOrdersArray.push({ 'product_id': element.id, 'quantity': element.qun });
            }
        });
        console.log(preparedOrdersArray);
    }

    saveOrderLocationAndSendOrder = function(flag) {
        if (flag == 0) {
            var pos = map.getCenter();
            var lat = pos.lat();
            var lng = pos.lng();
            var obj = { "lat": lat, "lng": lng };
            var locationInfo = JSON.stringify(obj);
            storage.setItem('orderLocation', locationInfo);
            prepareOrdersToSend();

            myApp.confirm('هل أنت متأكد من عمليت الشراء', 'SMARTCART',
                function() {
                    myApp.closeModal('#myMap', true);
                    var userData = storage.getItem('userData');
                    var orders = storage.getItem('orders');
                    var orderLocation = storage.getItem('orderLocation');
                    var ordersAsArray = eval(orders);
                    myApp.showIndicator();
                    $.post("http://63.142.251.169/sb/restapi/placeOrder.php", { preparedOrdersArray, userData, orderLocation }, function(data) {
                        myApp.hideIndicator();
                        console.log(data);
                        var dataAsJSON = $.parseJSON(data);
                        myApp.alert("يرجى حفظ رقم الطلب لإستلام الطلبية  <h4>" + dataAsJSON.id + "</h4>");
                    });
                },
                function() {
                    myApp.closeModal('#myMap', true);
                }
            );
        }
        if (flag == 1) {
            myApp.prompt('Location Name', 'SMARTCART', function(value) {
                var stringFavLocations = storage.getItem('favLocations');
                var objFavLocations = JSON.parse(stringFavLocations);
                var favLocationCoord = map.getCenter();
                var favLocationName = value;
                objFavLocations.push({ name: favLocationName, lat: favLocationCoord.lat(), lng: favLocationCoord.lng() });
                var stringifyObjFavLocations = JSON.stringify(objFavLocations);
                storage.setItem('favLocations', stringifyObjFavLocations);
                listfavLocations();
                saveOrderLocationAndSendOrder(0);
            }, function(argument) {
                myApp.closeModal('#myMap', true);
            });
        }
    }


    initMap = function() {
        var jordan = { lat: 31.963158, lng: 35.930359 };
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 18,
            center: jordan,
            zoomControl: false,
            scaleControl: false,
            fullscreenControl: false,
            streetViewControl: false,
        });

        // infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // infoWindow.setPosition(pos);
                // infoWindow.setContent('Location found.');
                // infoWindow.open(map);
                map.setCenter(pos);
            }, function() {
                myApp.alert('Please Enable GPS To get Current Loacation');
                // handleLocationError(true, infoWindow, map.getCenter());
            }, { timeout: 2000, enableHighAccuracy: true });
        } else {
            // Browser doesn't support Geolocation
            // handleLocationError(false, infoWindow, map.getCenter());
        }
    }


    showMapModel = function(argument) {

        myApp.modal({
            title: 'SMARTCART',
            text: 'إختر مكان إستلام الطلب',
            verticalButtons: true,
            buttons: [{
                    text: 'Current Location',
                    onClick: function() {
                        // mainView.router.loadPage("./map.html");
                        myApp.loginScreen("#myMap", true);
                        $("#mapDoneBtn").one('click', function(event) {
                            saveOrderLocationAndSendOrder(0);
                        });
                        initMap();
                    }
                },
                {
                    text: 'Other Location',
                    onClick: function() {
                        myApp.loginScreen("#myMap", true);
                        $("#mapDoneBtn").one('click', function(event) {
                            saveOrderLocationAndSendOrder(0);
                        });
                        initMap();
                    }
                },
                {
                    text: 'Favorite Locations',
                    onClick: function() {
                        mainView.router.loadPage("./favoriteLocation.html");
                    }
                },
                {
                    text: 'Close',
                    onClick: function() {

                    }
                }
            ]
        });
    }

    openProductPageForCat = function(id) {
        mainView.router.loadPage('./products.html');

        $('#productList').html('');
        if (reqArrayCate.includes(id)) {
            myApp.hideIndicator();
            mainProductsArray.forEach(function(post) {
                ////storage.setItem(post.id, JSON.stringify(post));
                console.log(post);
                if (post.categories["0"].id == id) {
                    createCard(post, "productList", post.qun);
                };
            });
            createSubCateTabs(id);

        } else {
            $$.getJSON("http://63.142.251.169/sb/restapi/getSpecificCateProducts.php", { id: id }, function(data) {
                myApp.hideIndicator();
                reqArrayCate.push(id);
                data.forEach(function(element) {
                    element.qun = 0;
                });
                // mainProductsArray = mainProductsArray.concat(data);
                
                console.log(mainProductsArray);
                data.forEach(function(post) {
                    if (!_.find(mainProductsArray, post)) {
                        mainProductsArray.push(post);
                    }
                });
                // data.forEach(function(post) {
                //     createCard(post, "productList", 0);
                // });
                createSubCateTabs(id);
            });
        }
    }

    createSubCateTabs = function(mainCateID) {

        $('#mainTabs').html('');
        $('#mainTabsLinks').html('');
        var tabsArray = [];


        mainProductsArray.forEach(function(element1) {
            if (element1.categories[0].id == mainCateID) {
                element1.categories.forEach(function(element2, index) {
                    if (!_.find(tabsArray, element2) && index == 1) {
                        tabsArray.push(element2);
                    }
                });
            }
        });
        console.log(tabsArray);
        tabsArray = _.sortBy(tabsArray, ['id']);
        tabsArray.forEach(function(element) {
            $('#mainTabs').append('<li class="tab col s3"><a href="#product_' + element.id + '">' + element.name + '</a></li>');
            $('#productTabs').append('<div id="product_' + element.id + '" class="col s12 "></div>');

        });
        $('ul.tabs').tabs();

        mainProductsArray.forEach(function(element) {
            if (element.categories[0].id == mainCateID && element.categories[1]) {
                createCard(element, 'product_' + element.categories[1].id, element.qun);

            }
        });


    }

    search = function(arg) {
        var searchedProduct = $('#searchBox').val();
        mainView.router.loadPage('./searchResult.html?searchedProduct=' + searchedProduct);

    }


    //////////////////////////////////////////////////////

    // Functions END

    ////////////////////////////////////////////////////
    getProdect = 0; //global veriable to prevent get product from server each time product page load
    productList = null;
    myApp.onPageInit('products', function(page) {
        // Do something here for "about" page

        myApp.showIndicator();
        if (getProdect == 0) {
            // myApp.showIndicator();
            // $$.getJSON("http://63.142.251.169/sb/restapi/products.php", function(data) {
            //     myApp.hideIndicator();
            //     data.forEach(function(post) {
            //         storage.setItem(post.id, JSON.stringify(post));
            //         createCard(post, "productList", 0);

            //     });
            //     productList = $('#productList').html();
            //     console.log(productList);
            // });
            getProdect = 1;

        } else {
            $('#productList').html(productList);
        }

    });

    myApp.onPageInit('cart', function(page) {
        ////// var orders = storage.getItem('orders');
        ////// var ordersAsArray = eval(orders);

        mainProductsArray.forEach(function(element) {
            if (element.qun > 0) {
                createCard(element, 'cartList', element.qun);
            }
        });

        ////// for (var i = 0; i < ordersAsArray.length; i++) {
        //////     var l = ordersAsArray[i];
        //////     createCard($.parseJSON(storage.getItem(l[0])), 'cartList', l[1]);
        ////// }
        // if (checkCardExist('cart')) {
        //     $("#btnCheckout").html('<a href="#" onclick="checkout()" class="button button-big button-round active">checkout</a>');
        // }

    });



    myApp.onPageInit('orderDetails', function(page) {
        console.log(page);
        console.log(page.query["line_items[0][id]"]);
        var counter = 0;
        while (page.query["line_items[" + counter + "][id]"]) {
            createMyOrderDetails(page, counter);
            counter++;
        }
        $('#total').html('Total: ' + page.query.total + '');

    });


    myApp.onPageInit('myOrder', function(page) {
        var data = storage.getItem('myOrder');
        var myOrder = $.parseJSON(data);
        $.each(myOrder, function(index, value) {
            createMyOrderList(index, value);
        });


    });

    myApp.onPageAfterAnimation('index', function(page) {

        ///////////////////////////////////////////
        //Swiper Every Time Index.html load
        //////////////////////////////////////////
        //initialize swiper when document ready
        mySwiper = new Swiper('.swiper-container', {
            // Optional parameters
            autoplay: {
                delay: 2000,
            },
            loop: true,
            speed: 500
        })
        ////////////////////////////////////////////////////////

    });

    myApp.onPageInit('favoriteLocation', function(page) {

        addFavLocation = function(argument) {
            myApp.loginScreen("#myMap", true);
            $("#mapDoneBtn").one('click', function(event) {
                saveOrderLocationAndSendOrder(1);
            });
            initMap();
        }

        listfavLocations = function(argument) {
            $('#favLocationsList').html('');
            var stringFavLocations = storage.getItem('favLocations');
            var objFavLocations = JSON.parse(stringFavLocations);
            for (var i = 0; i < objFavLocations.length; i++) {
                console.log(objFavLocations[i].name);
                favLocationsList(objFavLocations[i].name);
            }
        }
        listfavLocations();
    });


    myApp.onPageInit('searchResult', function(page) {

        var searchedProduct = page.query.searchedProduct;
        myApp.showIndicator();
        $$.getJSON("http://63.142.251.169/sb/restapi/searchResult.php", { 'searchedProduct': searchedProduct }, function(data) {
            myApp.hideIndicator();
            console.log(data);
            data.forEach(function(post) {
                if (!_.find(mainProductsArray, post)) {
                    mainProductsArray.push(post);
                    post.qun=0; 
                }
               var productToView= _.find(mainProductsArray,post);
               createCard(productToView,'searchResult',productToView.qun);
            });
        });

    });


    myApp.onPageInit('noConn', function(page) {
        // myApp.hideIndicator();
        // myApp.hideToolbar('#mainToolbar',true);
        // var h = $("#noConnPage").css('height');
        // $("#noConnPageCard").css('height', h);
    });

    myApp.onPageBeforeRemove('noConn', function(page) {
        //myApp.hideIndicator();
        // var h = $("#noConnPage").css('height');
        // $("#noConnPageCard").css('height', h);
    });

    myApp.onPageInit('map', function(page) {


        function initMap() {
            var uluru = { lat: 31.963158, lng: 35.930359 };
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 18,
                center: uluru
            });
            var marker = new google.maps.Marker({
                position: uluru,
                map: map
            });
            infoWindow = new google.maps.InfoWindow;

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    infoWindow.setPosition(pos);
                    infoWindow.setContent('Location found.');
                    infoWindow.open(map);
                    map.setCenter(pos);
                }, function() {
                    myApp.alert('Please Enable GPS To get Current Loacation');
                    handleLocationError(true, infoWindow, map.getCenter());
                }, { timeout: 5000, enableHighAccuracy: true });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter());
            }
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {

            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your Device doesn\'t support geolocation.');
            infoWindow.open(map);
        }

        initMap();


    });


    setTimeout(function() {
        var value = storage.getItem('userData');
        var userDataJSON = $.parseJSON(value);
        if (userDataJSON) {
            // myApp.showIndicator();
            // $.post('http://63.142.251.169/sb/restapi/retrieveCustomer.php', { 'id': userDataJSON.id }, function(data, textStatus, xhr) {
            //     myApp.hideIndicator();

            // });
        } else {
            myApp.loginScreen('#mainLogin', false);
        }
    }, 1);

    ///////////////////////////////////////////
    //Swiper For First Time Index.html load
    //////////////////////////////////////////
    //initialize swiper when document ready
    mySwiper = new Swiper('.swiper-container', {
        // Optional parameters
        autoplay: {
            delay: 2000,
        },
        loop: true,
        speed: 500
    })
    ////////////////////////////////////////////////////////


    ///////////////////////////////////////////
    //Retrive Categories
    //////////////////////////////////////////


    retrieveCategories = function(argument) {
        myApp.showIndicator();
        $$.getJSON("http://63.142.251.169/sb/restapi/retrieveCategories.php", function(data) {
            myApp.hideIndicator();
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                createCategoriesGridList(data[i]);
            }
            // data.forEach(function(post) {
            //     storage.setItem(post.id, JSON.stringify(post));
            //     createCard(post, "productList", 0);

            // });
            // productList = $('#productList').html();
            // console.log(productList);
        });

    }

    $(document).ready(function() {
        retrieveCategories();
        myApp.searchbar('.searchbar');

        // $("#searchBtn").click(function (argument) {

        // });

        $("#searchBox").keyup(function(event) {
            if (event.keyCode === 13) {
                $("#searchBtn").click(function(argument) {
                    search();
                });


            }
        });
    });

    ////////////////////////////////////////////////////////





}
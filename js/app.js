$(function() {

    var data = {
        top: 100,
        left: 100,
        width: 200,
        height: 200,
        lastID: 0,
        resizeRTop: 100,
        resizeRLeft: 290,
        resizeBTop: 290,
        resizeBLeft: 100,
        resizeRBTop: 280,
        resizeRBLeft: 280,
        pizzas: [],
    };


    var octopus = {
        addPizza: function() {
            var thisID = ++data.lastID;

            data.pizzas.push({
                id: thisID,
                visible: true,
                top: data.top,
                left: data.left,
                width: data.width,
                height: data.height,
                isDrag: false,
                RisDrag: false,
                BisDrag: false,
                RBisDrag: false,
                resizeRTop: data.resizeRTop,
                resizeRLeft: data.resizeRLeft,
                resizeBTop: data.resizeBTop,
                resizeBLeft: data.resizeBLeft,
                resizeRBTop: data.resizeRBTop,
                resizeRBLeft: data.resizeRBLeft,
            });
            view.render();
        },
        //删除方块函数
        removePizza: function(pizza) {
            var clickedPizza = data.pizzas[pizza.id - 1];
            clickedPizza.visible = false;
            view.render();
        },
        //方块鼠标点击函数
        mousedownPizza: function(e, pizza) {
            var clickedPizza = data.pizzas[pizza.id - 1];
            clickedPizza.isDrag = true;
            mouseInitX = e.pageX - clickedPizza.left;
            mouseInitY = e.pageY - clickedPizza.top;
            console.log("nihao");
        },
        //右边框鼠标点击函数
        mousedownresizeR: function(e, resizeR) {
            var clickedresize = data.pizzas[resizeR.id - 1];
            clickedresize.RisDrag = true;
            m_start_x = e.pageX - clickedresize.resizeRLeft;
        },
        //下边框鼠标点击函数
        mousedownresizeB: function(e, resizeB) {
            var clickedresize = data.pizzas[resizeB.id - 1];
            clickedresize.BisDrag = true;
            m_start_y = e.pageY - clickedresize.resizeBTop;
        },
        mousedownresizeRB: function(e, resizeRB){
             var clickedpizza = data.pizzas[resizeRB.id - 1];
            clickedpizza.RBisDrag = true;
            RBInitX = e.pageX - clickedpizza.resizeRBLeft;
            RBInitY = e.pageY - clickedpizza.resizeRBTop;

        },
        //边框拖动函数
        mousemoveresize: function(e, resizeR) {
            var clickedresize = data.pizzas[resizeR.id - 1];
             if (clickedresize.isDrag === true) {
                var moveX = e.pageX - mouseInitX;
                var moveY = e.pageY - mouseInitY;

                var Xmax = $(window).width() - clickedresize.width;
                var Ymax = $(window).height() - clickedresize.height;

                clickedresize.top = Math.min(Ymax, Math.max(0, moveY));
                clickedresize.left = Math.min(Xmax, Math.max(0, moveX));

                
                clickedresize.resizeRTop = clickedresize.top;
                clickedresize.resizeRLeft = clickedresize.left + clickedresize.width - 10;

                clickedresize.resizeBTop = clickedresize.top + clickedresize.height - 10;
                clickedresize.resizeBLeft = clickedresize.left;

                clickedresize.resizeRBTop = clickedresize.top + clickedresize.height - 20;
                clickedresize.resizeRBLeft = clickedresize.left + clickedresize.width - 20;
                view.render();
            }
            else if (clickedresize.BisDrag === true) {
                clickedresize.resizeBTop = Math.max(e.pageY - m_start_y, clickedresize.top + 50);
                clickedresize.height = Math.max(clickedresize.resizeBTop - clickedresize.top + 10, 50);
                clickedresize.resizeRBTop = clickedresize.top + clickedresize.height - 20;
                view.render();
            } 
            else if (clickedresize.RisDrag === true) {
                var RX = e.pageX - m_start_x;
                clickedresize.resizeRLeft = Math.max(clickedresize.left + 50, RX);
                clickedresize.width = Math.max(50, clickedresize.resizeRLeft - clickedresize.left + 10);
                clickedresize.resizeRBLeft = clickedresize.left + clickedresize.width - 20;
                view.render();
            }
            else if (clickedresize.RBisDrag === true) {
                var RBX = e.pageX - RBInitX;
                var RBY = e.pageY - RBInitY;
                clickedresize.resizeRBTop = Math.max(clickedresize.top + 50, RBY);
                clickedresize.resizeRBLeft = Math.max(clickedresize.left + 50, RBX);

                clickedresize.width = Math.max(50, clickedresize.resizeRBLeft - clickedresize.left + 20);
                clickedresize.height = Math.max(50, clickedresize.resizeRBTop - clickedresize.top + 20);

                clickedresize.resizeRLeft = clickedresize.left + clickedresize.width - 10;
                clickedresize.resizeBTop = clickedresize.top + clickedresize.height - 10;
                view.render();
            }
        },
        //鼠标弹起函数
        mouseup: function(e, pizza) {
            var clickedPizza = data.pizzas[pizza.id - 1];
            clickedPizza.isDrag = false;
            clickedPizza.RisDrag = false;
            clickedPizza.BisDrag = false;
            clickedPizza.RBisDrag = false;



        },

        getVisiblePizzas: function() {
            var visiblePizzas = data.pizzas.filter(function(pizza) {
                return pizza.visible;
            });
            return visiblePizzas;
        },

        init: function() {
            view.init();
        }
    };


    var view = {
            //界面初始化函数
            init: function() {
                var addPizzaBtn = $('.add-pizza');
                addPizzaBtn.click(function() {
                    octopus.addPizza();
                });

                // grab elements and html for using in the render function
                this.$pizzaList = $('.pizza-list');
                this.pizzaTemplate = $('script[data-template="pizza"]').html();

                // Delegated event to listen for removal clicks
                this.$pizzaList.on('mousedown', '.remove-pizza', function(e) {
                    var pizza = $(this).parents('.pizza').data();
                    octopus.removePizza(pizza);
                    return false;
                });

                //移动大方块绑定事件
                this.$pizzaList.on('mousedown', '.pizza', function(e) {
                    var pizza = $(this).data();
                    octopus.mousedownPizza(e, pizza);
                    $(document).mousemove(function(e) {
                        octopus.mousemoveresize(e, pizza);
                    });
                    $(document).mouseup(function(e) {
                        octopus.mouseup(e, pizza);
                    });
                    return false;
                });
                //右边框绑定事件
                this.$pizzaList.on({
                    mousedown: function(e) {
                        e.stopPropagation();
                        var pizza = $(this).parent('.pizza').data();
                        octopus.mousedownresizeR(e, pizza);
                        $(document).mousemove(function(e) {
                            octopus.mousemoveresize(e, pizza);
                        });
                        $(document).mouseup(function(e) {
                            octopus.mouseup(e, pizza);
                        })
                    }
                }, '.resizeR');

                //下边框绑定事件
                this.$pizzaList.on({
                    mousedown: function(e) {
                        e.stopPropagation();
                        var pizza = $(this).parent('.pizza').data();
                        octopus.mousedownresizeB(e, pizza);
                        $(document).mousemove(function(e) {
                            octopus.mousemoveresize(e, pizza);
                        });
                        $(document).mouseup(function(e) {
                            octopus.mouseup(e, pizza);
                        })
                    }
                }, '.resizeB'); //移动右边框
         
            this.$pizzaList.on({
                mousedown: function(e) {
                    e.stopPropagation();
                    var pizza = $(this).parent('.pizza').data();
                    octopus.mousedownresizeRB(e, pizza);
                    $(document).mousemove(function(e) {
                        octopus.mousemoveresize(e, pizza);
                    });
                    $(document).mouseup(function(e) {
                        octopus.mouseup(e, pizza);
                    })
                }
            }, '.resizeRB'); //移动右下小方块

            this.render();
        },
        render: function() {
            // Cache vars for use in forEach() callback (performance)
            var $pizzaList = this.$pizzaList,
                pizzaTemplate = this.pizzaTemplate;
            $(".pizza").css("cursor", "pointer")
            // Clear and render
            $pizzaList.html('');
            octopus.getVisiblePizzas().forEach(function(pizza) {
                // Replace template markers with data
                var thisTemplate = pizzaTemplate.replace(/{{id}}/g, pizza.id);
                $pizzaList.append(thisTemplate);
                $("div[data-id=" + pizza.id + "]").offset({ top: pizza.top, left: pizza.left }).css({ 'width': pizza.width + 'px', 'height': pizza.height + 'px' });
                $("div[data-id=" + pizza.id + "] > .resizeR").offset({ top: pizza.resizeRTop, left: pizza.resizeRLeft });
                $("div[data-id=" + pizza.id + "] > .resizeB").offset({ top: pizza.resizeBTop, left: pizza.resizeBLeft });
            });
        }
}; octopus.init();
}());
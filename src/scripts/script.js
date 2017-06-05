jQuery(document).ready(function ($) {

    /* чередование цветов рядов таблицы */
    function addBgc() {
        $(".basket-item:odd").addClass("basket-item--bg");
        $(".basket-item:even").removeClass("basket-item--bg");
    }
    addBgc();


    /* изменение количества товара по кнопкам +/- */
    function changeInputValue() {
        function changeAmount(btn, action, limit) {
            btn.click(function (e) {
                var input = $(this).closest(".basket-item__counter").find(".basket-item__amount");
                var val = input.val();
                e.preventDefault();
                if (val > limit) {
                    val = +val + 1*action;
                }
                if (val <= 0) {
                    $(this).closest(".basket-item__counter").find(".btn--less").addClass("btn--unactive");
                } else {
                    $(this).closest(".basket-item__counter").find(".btn--less").removeClass("btn--unactive");
                }
                input.val(val);
                countCost();
            });
        }
        changeAmount($(".btn--more"), 1, -1);
        changeAmount($(".btn--less"), -1, 0);
    }
    changeInputValue();


    /* изменение количества товара при изменении value у input */
    $(".basket-item__amount").change(function (e) {
        e.preventDefault();
        if ($(this).val().match(/[^0-9]/g)) {
            $(this).val(0);
            $(this).closest(".basket-item__counter").find(".btn--less").addClass("btn--unactive");
        }
        if ($(this).val() <= 0) {
            $(this).val(0);
            $(this).closest(".basket-item__counter").find(".btn--less").addClass("btn--unactive");
        } else if ($(this).val() > 999) {
            $(this).val(999);
            $(this).closest(".basket-item__counter").find(".btn--less").removeClass("btn--unactive");
        } else {
            $(this).closest(".basket-item__counter").find(".btn--less").removeClass("btn--unactive");
        }
        // correctInputValue($(this))
        countCost();
    });


    /* корректировка значений в input */
    // function correctInputValue(input) {
    //     if (input.val().match(/[^0-9]/g)) {
    //         input.val(0);
    //         input.closest(".basket-item__counter").find(".btn--less").addClass("btn--unactive");
    //     }
    //     if (input.val() <= 0) {
    //         input.val(0);
    //         input.closest(".basket-item__counter").find(".btn--less").addClass("btn--unactive");
    //     } else if ($(this).val() > 999) {
    //         input.val(999);
    //         input.closest(".basket-item__counter").find(".btn--less").removeClass("btn--unactive");
    //     } else {
    //         input.closest(".basket-item__counter").find(".btn--less").removeClass("btn--unactive");
    //     }
    //     // return input;
    // }



    /* добавление пробелов в разрядах */
    function addSpacesToNumbers(num) {
        if (num < 10000) {
            return num;
        } else {
            return String(num).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
        }
    }


    /* расчет стоимости товара */
    function countCost() {
        var basketTotalCost = 0;
        var basketItem = $(".basket-item");
        $(basketItem).each(function () {

            /* форматирование цены товара */
            var itemPrice = $(this).find(".basket-item__price");
            var itemPriceText = itemPrice.text();
            itemPriceText = addSpacesToNumbers(itemPriceText);
            itemPrice.text(itemPriceText);

            /* расчет стоимости */
            var basketItemPrice = $(this).find(".basket-item__price").text().replace(/\D/g, "");
            var basketItemAmount = $(this).find(".basket-item__amount").val();
            var basketItemCost = basketItemPrice*basketItemAmount;
            if (basketItemCost <= 0) {
                $(this).find(".basket-item__cost").text("-");
                basketItemCost = 0;
            } else {
                $(this).find(".basket-item__cost").text(addSpacesToNumbers(basketItemCost));
            }
            basketTotalCost += basketItemCost;
        });
        countTotal(basketTotalCost);
    }
    countCost();


    /* вывод в Итого */
    function countTotal(total) {
        $(".basket-total__cost--no-discount").text(addSpacesToNumbers(total) + " p");
        var discount;
        if (total >= 150000) {
            discount = 0.15;
        } else if (total >= 100000) {
            discount = 0.1;
        } else if (total >= 50000) {
            discount = 0.05;
        } else {
            discount = 0;
        }
        $(".discount").text(discount*100+"%");
        var basketTotalCostDiscount = total - total*discount;
        $(".basket-total__cost--discount").text(addSpacesToNumbers(basketTotalCostDiscount) + " p");
        if (discount) {
            $(".basket-total__text a").show();
            $(".basket-total__line:eq(1)").show();
        } else {
            $(".basket-total__text a").hide();
            $(".basket-total__line:eq(1)").hide();
        }
    }


    /* ссылка удалить */
    $(".delete").click(function (e) {
        e.preventDefault();
        $(this).closest(".basket-item").remove();
        addBgc();
        countCost();
    });


    /* ссылка удалить все */
    $(".delete-all").click(function (e) {
        e.preventDefault();
        $(".basket__form").remove();
    });


});

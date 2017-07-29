$(document).ready(function () {

    //自訂驗證規則，正規表示式。

    //住家電話
    jQuery.validator.addMethod("isPhone", function (value, element) {
        //var tel = /^0\d{1,3}-\d{5,8}$/;
        var tel = /^(\d{8}|\d{10})$/;
        return this.optional(element) || (tel.test(value));
    }, "格式錯誤，請正確的電話號碼格式");

   

    //下拉式選單不為空值(-1)
    $.validator.addMethod("notEqualsto", function (value, element, arg) {
        return arg != value;
    }, "必須填寫");

    //將訊息顯示於radio和checkbox後面
    jQuery.extend(jQuery.validator.defaults,{
        errorPlacement: function (error, element) {
            if (element.is(':radio') || element.is(':checkbox')) {
                var eid = element.attr('name');
                $('input[name=' + eid + ']:last').next().after(error);
            }
            else {
                error.insertAfter(element);
            }
        }
    });


    //填寫報名表
    $("#formIndex").validate({ //前端form
        rules: {
            txt_place: { //如果空間位置為其他時，空間為必填
                required: true
            },
            TextBox1: { //學號
                required: true
            },
            txt_name :{
                required: true
            },
            txt_connect: {
                required: true,
                isPhone: true,
                
            },
            txt_email: {
                required: true,
                email: true
            },
            DropDownList3: { //事件等級
                notEqualsto: "請選擇"
            },
            DropDownList4: { //需求速別
                notEqualsto: "請選擇"
            }
        },
        messages: {
            DropDownList3: {
                notEqualsto: "請選擇事件等級"
            },
            DropDownList4: {
                notEqualsto: "請選擇需求速別"
            }
        }
    })
    
});


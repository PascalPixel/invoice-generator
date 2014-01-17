$(document).ready(function () {

//Item layout
var $item =
"<li class=\"item\" style=\"display:none;\">"+
  "<div class=\"row\">"+
    "<div class=\"col-lg-4\">"+
      "<input class=\"form-control\" onclick=\"this.select()\" type=\"text\" value=\"Item description\">"+
    "<\/div>"+
    "<div class=\"col-xs-12 col-sm-4 col-lg-2\">"+
      "<select class=\"type\">"+
        "<option value=\"0\"> Hours <\/option>"+
        "<option value=\"1\"> Fixed <\/option>"+
        "<option value=\"2\"> Quantity <\/option>"+
        "<option value=\"3\"> Mileage <\/option>"+
      "<\/select>"+
      "<div class=\"caret\"><\/div>"+
    "<\/div>"+
    "<div id=\"item-input\" class=\"col-xs-4 col-sm-3 col-lg-2\">"+
      "<div class=\"input-type\">"+
        "<span class=\"currency\"><\/span>"+
        "<input class=\"item-input-actual form-control hours\" onclick=\"this.select()\" type=\"text\" value=\"0\">"+
        "<span class=\"percentage\">%<\/span>"+
      "<\/div>"+
    "<\/div>"+
    "<div id=\"item-times\" class=\"col-xs-4 col-sm-2 col-lg-2\">"+
      "<div class=\"input-type timest\">"+
        "<span class=\"times\">x<\/span>"+
        "<input class=\"item-input-quantity form-control\" onclick=\"this.select()\" type=\"text\" value=\"0\">"+
      "<\/div>"+
    "<\/div>"+
    "<div id=\"item-total\" class=\"col-xs-4 col-sm-3 col-lg-2\">"+
      "<h4>"+
        "<span class=\"currency\"><\/span>"+
        "<span class=\"itemtotal\">0<\/span>"+
      "<\/h4>"+
    "<\/div>"+
  "<\/div>"+
"<\/li>";

//Add item
function appendItem() {
  $("#items").append($item);
  setCurrency();
}

//When plus is clicked add another item
$('.plus').click(function () {
  appendItem();
  $("#items").find(".item:last").slideDown("fast");
});

//Append first item on load
appendItem();
$("#items").find(".item:last").show();

//Setting currency
function setCurrency() {
  //Get currency from select input
  var currency = $('#currency').val();
  //Set currencySign var to be safe
  var currencySign;
  //Get currencySign based on currency selected
  if (currency == 'USD') {
    currencySign = '$';
  } else if (currency == 'CNY') {
    currencySign = '&yen;';
  } else if (currency == 'EUR') {
    currencySign = '&euro;';
  } else if (currency == 'GBP') {
    currencySign = '&pound;';
  } else {
    currencySign = '&yen;';
  }
  //Print currency on form
  $('.currency').html(currencySign);
}
$('#currency').on('change', function(){
  setCurrency();
});

//Change input box on item to type of input
$("#invoice").delegate( ".item .type", "change", function() {
  var itemtotal = $(this).closest(".row").find(".item-input-actual");
  var inputType = $(this).closest(".row").find(".input-type");
  var inputQuantity = $(this).closest(".row").find(".timest");
  if ($(this).val() == 0) {
    itemtotal.removeClass("fixed quantity mileage").addClass("hours");
    inputQuantity.hide();
    inputType.removeClass("money");
  } else if ($(this).val() == 1) {
    itemtotal.removeClass("hours quantity mileage").addClass("fixed");
    inputQuantity.hide();
    inputType.addClass("money");
  } else if ($(this).val() == 2) {
    itemtotal.removeClass("fixed hours mileage").addClass("quantity");
    inputQuantity.show();
    inputType.addClass("money");
  } else {
    itemtotal.removeClass("fixed quantity hours").addClass("mileage");
    inputQuantity.hide();
    inputType.removeClass("money");
  }
  calcTotal();
});

//Add tax when tax is input
$('#tax-amount').on('keyup', function() {
  $('.tax-bar').slideDown();
});

//Global variable settings
var rate;
var mile;
var tax;
//Settings
function settings() {
  //Get hourly rate from input
  rate = Number($('#rate-amount').val());
  //Get cost per mile from input
  mile = Number($('#mile-amount').val());
  //Get tax from input
  tax = Number($('#tax-amount').val());
  //Print the tax percentage
  $('#tax-print').html('Tax ' + tax + '%');
}

//2 decimal rounding
function twoDecimals(numberToRound) {
  return Math.round(numberToRound * 100) / 100;
}

//Minutes to decimal point
function minToDec(min) {
 var minDec = ((min / 3) * 5) / 100;
}

//Function to calculate based on hours
function calcHours() {
  $('#invoice').find('.hours').each(function(){
    $(this).closest(".row").find('.itemtotal').html(twoDecimals($(this).val() * rate));
  });
}

//Function for fixed cost
function calcFixed() {
  $('#invoice').find('.fixed').each(function(){
    $(this).closest(".row").find('.itemtotal').html(twoDecimals($(this).val()));
  });
}

//Function for quantity
function calcQuantity() {
  $('#invoice').find('.quantity').each(function(){
    var amount = $(this).closest(".row").find('.item-input-quantity').val();
    var price = $(this).val();
    $(this).closest(".row").find('.itemtotal').html(twoDecimals(amount * price));
  });
}

//Function to calculate based on milage
function calcMileage() {
  $('#invoice').find('.mileage').each(function(){
    $(this).closest(".row").find('.itemtotal').html(twoDecimals($(this).val() * mile));
  });
}

//Function for form calculation
function calcTotal() {
  setCurrency();
  settings();
  calcHours();
  calcFixed();
  calcQuantity();
  calcMileage();
  //Add up all items
	var subtotal = 0;
	$('#invoice').find('.itemtotal').each(function () {
		var value = parseInt($(this).text());
		if (!isNaN(value)) subtotal += value;
	});
  //Print subtotal - Two decimals for print only
  $('.subtotal').html(twoDecimals(subtotal));
  //Calculate tax
  var taxed = (subtotal / 100 * tax);
  //Print tax - Two decimals for print only
  $('.taxed').html(twoDecimals(taxed));
  //Add up tax to subtotal - Actually round total up to two decimals
  var total = twoDecimals(subtotal + taxed);
  //Print total
  $('.total').html(total);
}

//Initial calculation on load
calcTotal();

//On input change recalculate
$('#invoice').on('keyup', 'input', function () {
  //Recalculate form
  calcTotal();
});

});
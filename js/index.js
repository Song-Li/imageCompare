// add picture to html
function get_pictures_by_id(column, id) {
  // clear this div
  $('#picture_' + column).empty();

  picture_ids = send_to_utils("get_pictures_by_id," + id).split(',');
  sorted = {}
  for(var idx in picture_ids) {
    v = picture_ids[idx]
      sorted[parseInt(v.split('_')[0])] = v.split('_')[1]
  }
  for(k in sorted){
    var img = new Image();
    // the cross origin cliam have to before src attrabute
    img.crossOrigin="Anonymous";
    img.id = column + k;
    img.src = address + sorted[k] + '.png';
    $('#picture_' + column).append(img);
  }
}

// this function is used to get the pixels of a img
// var: img html object
// return: array of pixels
function get_pixel_from_img(img_id) {
  var img = document.getElementById(img_id); 
  var width = img.clientWidth;
  var height = img.clientHeight;
  // the canvas may be taint for cross origin info
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0);
  data = context.getImageData(0, 0, width, height);
  delete canvas;
  return data; 
}


function sub_pic_data(pic1_data, pic2_data) {
  var sub_data = pic1_data;
  var same = true;
  for (var i in pic1_data.data) {
    // both the two will be considered
    sub_data.data[i] = Math.abs(pic1_data.data[i] - pic2_data.data[i]);

    // here we make the pixels 50 times brighter
    // may overflow, but seems ok
    sub_data.data[i] *= 50;

    // force set every alpha value to be 255
    if (i % 4 == 3) {
      sub_data.data[i] = 255;
    }else if (sub_data.data[i] != 0) {
      same = false;
    }
  }
  sub_data.same = same;
  return sub_data;
}

// subtract all the imgs
function subtract() {
  // clear the res div
  $('#subtract').empty();
  // here we only have 28 pictures
  pic1_data = get_pixel_from_img("img1");
  pic2_data = get_pixel_from_img("img2");
  var sub_data = sub_pic_data(pic1_data, pic2_data);

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = sub_data.width;
  canvas.height = sub_data.height;
  ctx.putImageData(sub_data, 0, 0);
  $('#subtract').append(canvas);

  var res_img = new Image(); 
  res_img.height = "32";
  res_img.width = "32";
  res_img.align = "top";
  if (sub_data.same) {
    res_img.src = "./img/yes.png";
  } else {
    res_img.src = "./img/no.png";
  } 

  $('#subtract').append(res_img);
}

function uploadImage(input, num) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#img' + num)
        .attr('src', e.target.result);
    };

    reader.readAsDataURL(input.files[0], 1.0);
  }
}

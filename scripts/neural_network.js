define(["./jquery", "./underscore"], function() {
	
	var reshape = function (arr, [m, d]) {

		//var arr = arr[0];
		if (arr.length / m != d) {
			throw "dimension error"
		} else {
			var array = []
			var start = 0;
			while (start < arr.length) {
				var row = arr.slice(start, start+d);
				array.push(row);
				start += d;
			}
		} return array;
	}; 

	var transpose = function (arr) {
		return _.unzip(arr);
	};

	function shape(arr) {
		if (arr.length == 0 || arr[0].length == 0) {
			throw "Check array dimension";
		} else {
			return [arr.length, arr[0].length];
		}
	};

	var dot_same = function (arr1, arr2) {
		if (arr1.length != arr2.length) {
			throw "incorrect dimensions";
		} else {
			var sum = 0;
			for (z = 0; z < arr1.length; z++) {
				sum += arr1[z] * arr2[z];
			}
			return sum;
		};
	};

	var dot = function (arr1, arr2) {
		if (arr1[0].length != arr2.length) {
			throw "incorrect dimensions";
		} else {
			arr2 = _.unzip(arr2);
			var product = [];
			for (var i = 0; i < arr2.length; i++) {
				var row = [];
				for (var j = 0; j < arr1.length; j++) {
					var num = dot_same(arr1[j], arr2[i]);
					row.push(num);
				}
				product.push(row);
			}
			return _.unzip(product);
		}
	};

	var check_zero = function (line) {
		height = line.length;
		for (i = 0; i < height; i++) {
			if (line[i] == 0) {
				return true;
			}
		} return false;
	};

	var contain = function (x, y) {

		for (var i = 0; i < x.length; i++) {
			if (x[i] == y) {
				return true;
			}
		};	return false;
	};

	var river = function(arr) {
		var gaps = [];
		for (var i = 1; i < arr.length; i++) {
			gaps.push(arr[i]-arr[i-1]);
		}; return max_2d(gaps, pos=true)+1;
	}

	var split_image_positions = function (image) {
		image = transpose(image);
		var width = 228;
		var height = 28;
		var position_start = [];
		var position_end = [];
		var mid = [];
		var i = 0;
		while (i < width) {
			var slice = image[i];
			if (contain(slice, 0)) {
				position_start.push(i);
				var y = 1;
				while (y < 100) {
					if (contain(image[i+y], 0) == false) {
						position_end.push(i+y);
						i += y;
						break;
					} else {
						y += 1;
					}
				}
			}
			i += 1;
		}
		
		for (var i = 0; i < position_start.length; i++) {
			mid.push((position_end[i] - position_start[i])/2 + position_start[i]);
		}; // river() finds the largest spacing between two numbers to know the splitting
		return [mid, river(mid)];
	};

	var max_2d = function (x, pos=true) {
		first = x[0];
		pos = 0
		for (i = 1; i < x.length; i++) {
			if (x[i] > first) {
				first = x[i];
				pos = i;
			}
		} if (pos) {
			return pos;
		} else {
			return first;
		}
	};

	var ones = function ([m, d]) {
		var array = [];
		for (var i = 0; i < m; i++) {
			var row = []
			for (var j = 0; j < d; j++) {
				row.push(1);
			}
			array.push(row);
		} return array;
	};

	var concatenate = function (arr1, arr2) {
		if (arr1.length != arr2.length) {
			throw "cannot concatenate different lengths"
		} else {
			arr1 = transpose(arr1);
			arr2 = transpose(arr2);
			for (var i = 0; i < arr2.length; i++) {
				arr1.push(arr2[i]);
			}
		} return transpose(arr1);
	};

	var flatten = function (arr) {
		var array = [];
		for (var i = 0; i < arr.length; i++) {
			for (var j = 0; j < arr[0].length; j++) {
				array.push(arr[i][j]);
			}
		} return array;
	};

	var split_image = function (image) {

		var width = 228;
		var image_info = split_image_positions(image);

		var middle_return = image_info[0];
		var from_left = image_info[1]

		var middle_n = middle_return.slice(1);
		var middle = middle_return.slice(0,middle_return.length-1);
		
		for (var i = 0; i < middle.length; i++) {
			var a = middle[i];
			var b = middle_n[i];
			middle[i] = b - a;
		};

		var maxi = max_2d(middle, pos=true)+1;
		
		var m = middle_return.length;
		var list_of_numbers = ones([m, 840]);
		
		for (i = 0; i < middle_return.length; i++) {
			num = ~~middle_return[i];
			
			if (num - 15 < 0) {
				var padding_width = 15 - num;
				var im = transpose(transpose(image).slice(0,num));
				var pad = ones([28, padding_width]);
				first_half = concatenate(pad, im);
			} else {
				first_half = transpose(transpose(image).slice(num-15,num));
			};

			if (num + 15 >= width) {
				var padding_width = num + 15 - width;
				var second_half = transpose(transpose(image).slice(num, -1));
				var pad = ones([28, padding_width]);
				second_half = concatenate(second_half, pad);
			} else {
				second_half = transpose(transpose(image).slice(num,num+15));
			};
			
			var full = concatenate(first_half, second_half);
			
			full = flatten(full);
			//console.log(full);
			for (j = 0; j < full.length; j++) {
				list_of_numbers[i][j] = (full[j]-0.90579)/0.29212;
			}
		}; return [list_of_numbers, from_left];
	};

	var leaky_relu = function (x) {
		for (j = 0; j < x.length; j++){
			for (i = 0; i < x[0].length; i++) {
					item = x[j][i];
					if (item > 0) {
						x[j][i] = item;
					} else {
						x[j][i] = 0.1*item;
					}
				};
		}; return (x);
	};

	function add(a, b) {
		return a+b;
	};

	var max = function (x, pos=true) {
		var dim = x[0].length;
		var large = []
		var position = []

		for (i = 0; i < x.length; i++) {
			var first = x[i][0];
			var index = 0;
			for (j = 1; j < dim; j++) {
				comp = x[i][j];
				if (comp > first) {
					first = comp;
					index = j;
				} 
			};
			large.push(first);
			position.push(index);
		}
		if (pos == true) {
			return position;
		} else {
			return large;
		}
	};

	var softmax = function (x) {
		//x = nj.array(x)
		//x = nj.array([0,0,0]);
		var dim = shape(x)[1];

		var large = max(x, pos=false);

		var sums = []

		for (i = 0; i < x.length; i++) {
			var sum = []
			for (j = 0; j < dim; j++) {
				var num = x[i][j];
				var m = large[i];
				exp = Math.exp(num-m);
				sum.push(exp);
				x[i][j] = exp;
			}
			total = sum.reduce(add,0);
			sums.push(total);
		};

		for (i = 0; i < x.ndim + 1; i++) {
			for (j = 0; j < dim; j++) {
				var num = x.get(i, j);
				var m = sums[i];
				x.set(i,j,(num/m));
			}
		}; return x;
	};

	var addition = function (weights, bias) {
		
		m = weights.length;
		dim = weights[0].length;
		for (var i = 0; i < m; i++) {
			b = bias[0][i];
			for (var j = 0; j < dim; j++) {
				w = weights[i][j];
				weights[i][j] = w+b;
			}
		}; return (weights);
	};

	var multiply_2d = function (x, scalar) {
		for (i = 0; i < x.length; i++) {
			x[i] *= 255;
		} return x;
	};

	var forward_propagate = function (data) {
		var b_json = [];

		var bias1;
		var bias2;
		var bias3;

		$.ajax({
			url: "./scripts/json/b.json",
			async: false,
			dataType: "json",
			success: function (data) {
				b_json = data;
			}
		});
		
		bias1 = b_json[0]
		bias2 = b_json[1]
		bias3 = b_json[2]

		var w_json = [];

		var weights1;
		var weights2;
		var output;

		$.ajax({
			url: "./scripts/json/w.json",
			async: false, 
			dataType: "json",
			success: function (data) {
				w_json = data;
			}
		});

		weights1 = w_json[0];
		weights2 = w_json[1];
		output = w_json[2];

		var test_image = [];
		var image;
		
		test_image = data;

		test_image = reshape(test_image, [28,228]);
		var image_info = split_image(test_image);

		var image = image_info[0];
		var from_left = image_info[1];

		var z1 = addition(dot(image, transpose(weights1)), transpose(bias1));
		
		var a1 = leaky_relu(z1);
		var z2 = addition(dot(a1, transpose(weights2)), transpose(bias2));
		var a2 = leaky_relu(z2);

		var z3 = addition(dot(a2, transpose(output)), transpose(bias3));
		var a3 = softmax(z3)

		prediction = max(a3, pos=true);
		console.log(prediction);

		return [prediction, from_left];
	};
	
	return {
		forward_propagate: function(data) {
			return forward_propagate(data);
		}
	};
});

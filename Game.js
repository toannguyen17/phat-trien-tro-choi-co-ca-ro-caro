//
let Game = function() {
	this.itemSelect = [];
	this.arrPlay    = ['isPlayO', 'isPlayX'];
	this.player     = 0;    // 0:O, 1:X
	this.isPlay     = false;
	this.boxLevel   = 30;

	this.winPlayerO    = 0;
	this.winPlayerX    = 0;

	this.gameBox       = document.querySelector('.gameBox');
	this.changerStatus = document.querySelector('#changerStatus');
	this.elWinO        = document.querySelector('#winO');
	this.elWinX        = document.querySelector('#winX');
	// element dialog
	this.dialog             = document.querySelector('.dialog');
	this.dialogContent      = this.dialog.querySelector('.content');
	this.dialogSelectPlayer = this.dialogContent.querySelector('.selectPlayer');
	this.dialogWin          = this.dialogContent.querySelector('.win');
	this.dialogWinPlayer    = this.dialogContent.querySelector('.player');

	this.dialogBG           = this.dialog.querySelector('.dialogBG');

	this.dialogBTNPlayerX   = this.dialogSelectPlayer.querySelector('.PlayerX');
	this.dialogBTNPlayerO   = this.dialogSelectPlayer.querySelector('.PlayerO');

	this.init();
}
Game.prototype.init = function(){
	this.paint();

	this.changerStatus.addEventListener('click', this.regChangerStatus.bind(this));
	this.dialogBTNPlayerX.addEventListener('click', this.selectPlayer.bind(this));
	this.dialogBTNPlayerO.addEventListener('click', this.selectPlayer.bind(this));
	this.dialogBG.addEventListener('click', this.closeDialog.bind(this));
}
Game.prototype.selectPlayer = function(e){
	let player = e.target.getAttribute('player');
	this.closeDialog();
	if (player === '1') {
		this.player = 1;
	}else{
		this.player = 0;
	}
	this.play();
}
Game.prototype.regChangerStatus = function(){
	if (this.isPlay) {
		this.restart();
	}else{
		this.start();
	}
}
// dialog
Game.prototype.closeDialog = function(e){
	this.dialog.style.display = 'none';
	this.dialogContent.style.width = '50px';
}
Game.prototype.showSelectPlayer = function(e){
	this.dialogSelectPlayer.style.display = 'block';
	this.dialogWin.style.display          = 'none';
	this.dialog.style.display             = 'block';
	setTimeout(function(){
		let width = window.innerWidth - 30;
		if (width > 600) width = 600;
		this.dialogContent.style.width = width + 'px';
	}.bind(this), 5);
}
Game.prototype.showWinPlayer = function(player){
	this.dialogSelectPlayer.style.display = 'none';
	this.dialogWin.style.display          = 'block';
	this.dialog.style.display             = 'block';
	setTimeout(function(){
		let width = window.innerWidth - 30;
		if (width > 600) width = 600;
		this.dialogContent.style.width = width + 'px';
	}.bind(this), 5);
}
// end dialog

Game.prototype.changerPlayer = function(){
	this.checWin();
	if (this.isPlay) {
		this.gameBox.classList.remove(this.arrPlay[this.player]);
		this.player = this.player === 0 ? 1 : 0;
		this.gameBox.classList.add(this.arrPlay[this.player]);
	}
}

Game.prototype.paint = function(){
	this.widthBox = 800/this.boxLevel;
	this.matrix   = [];
	let box = document.createElement('div');
	box.setAttribute('class', 'game');
	for (let tr = 0; tr < this.boxLevel; tr++) {
		let cot = [];
		for (let td = 0; td < this.boxLevel; td++) {
			let x    = td*this.widthBox;
			let y    = tr*this.widthBox;
			let data = {x:td*this.widthBox, y:tr*this.widthBox};
			let el   = document.createElement('div');
			el.setAttribute('class', 'item');
			el.setAttribute('style', 'width:'+this.widthBox+'px;height:'+this.widthBox+'px;left:'+x+'px;top:'+y+'px');
			el.innerHTML = '<div class="ripple"><div class="ripple-element"></div></div><div class="defineXO defineX"></div><div class="defineXO defineO"></div>';
			el.RedT = new Item(el, this, td, tr);
			cot.push(el);
			box.appendChild(el);
		}
		this.matrix.push(cot);
	}
	this.gameBox.appendChild(box);
}
Game.prototype.start = function(){
	if (this.isPlay === false) {
		this.showSelectPlayer();
	}
}
Game.prototype.restart = function(){
	this.stop();
	this.start();
}

Game.prototype.win = function(win){
	this.stop();
	setTimeout(function(){
		this.showWinPlayer();
		if (win.player === 0) {
			this.winPlayerO++;
			this.dialogWinPlayer.innerText = 'O';
			this.dialogWinPlayer.classList.remove('PlayerX');
			this.dialogWinPlayer.classList.add('PlayerO');
		}else{
			this.winPlayerX++;
			this.dialogWinPlayer.innerText = 'X';
			this.dialogWinPlayer.classList.remove('PlayerO');
			this.dialogWinPlayer.classList.add('PlayerX');
		}
		this.elWinO.innerText = 'Win: ' + this.winPlayerO;
		this.elWinX.innerText = 'Win: ' + this.winPlayerX;
	}.bind(this), 1000);
}

Game.prototype.checWin = function(){
	let win = null;
	for (let i = 0; i < this.itemSelect.length; i++) {
		let item = this.itemSelect[i];

		// Left
		let check = this.checWinLeft(item);
		if (check !== void 0) {
			win = check;
			break;
		}
		// Left Top
		check = this.checWinLeftTop(item);
		if (check !== void 0) {
			win = check;
			break;
		}
		// Left Bottom
		check = this.checWinLeftBottom(item);
		if (check !== void 0) {
			win = check;
			break;
		}
		// Right
		check = this.checWinRight(item);
		if (check !== void 0) {
			win = check;
			break;
		}
		// Right Top
		check = this.checWinRightTop(item);
		if (check !== void 0) {
			win = check;
			break;
		}
		// Right Bottom
		check = this.checWinRightBottom(item);
		if (check !== void 0) {
			win = check;
			break;
		}
		// Top
		check = this.checWinTop(item);
		if (check !== void 0) {
			win = check;
			break;
		}
		// Bottom
		check = this.checWinBottom(item);
		if (check !== void 0) {
			win = check;
			break;
		}

	}
	if (win !== null) {
		// tìm ra người chiến thắng;
		this.win(win);
	}
}
//
Game.prototype.checWinLeft = function(item){
	let data = {rotate:0, type: 'left', player:item.RedT.type, length:1, first:item, last:null};
	let x    = item.RedT.x-1;
	let win  = true;
	while(win){
		let a = this.matrix[item.RedT.y][x];
		if (a !== void 0 && a.RedT.type === item.RedT.type) {
			data.length++;
			data.last = a;
		}else{
			win = false;
		}
		x--;
	}
	if (data.length >= 5) {
		return data;
	}
	return void 0;
}
Game.prototype.checWinLeftTop = function(item){
	let data = {rotate:45, player:item.RedT.type, length:1, first:item, last:null};
	let x    = item.RedT.x-1;
	let y    = item.RedT.y-1;
	let win  = true;
	while(win){
		let aY = this.matrix[y];
		if (aY !== void 0) {
			let a = this.matrix[y][x];
			if (a !== void 0 && a.RedT.type === item.RedT.type) {
				data.length++;
				data.last = a;
			}else{
				win = false;
			}
		}else{
			win = false;
		}
		x--;
		y--;
	}
	if (data.length >= 5) {
		return data;
	}
	return void 0;
}
Game.prototype.checWinLeftBottom = function(item){
	let data = {rotate:-45, player:item.RedT.type, length:1, first:item, last:null};
	let x    = item.RedT.x-1;
	let y    = item.RedT.y+1;
	let win  = true;
	while(win){
		let aY = this.matrix[y];
		if (aY !== void 0) {
			let a = this.matrix[y][x];
			if (a !== void 0 && a.RedT.type === item.RedT.type) {
				data.length++;
				data.last = a;
			}else{
				win = false;
			}
		}else{
			win = false;
		}
		x--;
		y++;
	}
	if (data.length >= 5) {
		return data;
	}
	return void 0;
}

Game.prototype.checWinRight = function(item){
	let data = {rotate:0, type: 'right', player:item.RedT.type, length:1, first:item, last:null};
	let x    = item.RedT.x+1;
	let win  = true;
	while(win){
		let a = this.matrix[item.RedT.y][x];
		if (a !== void 0 && a.RedT.type === item.RedT.type) {
			data.length++;
			data.last = a;
		}else{
			win = false;
		}
		x++;
	}
	if (data.length >= 5) {
		return data;
	}
	return void 0;
}
Game.prototype.checWinRightTop = function(item){
	let data = {rotate:-45, player:item.RedT.type, length:1, first:item, last:null};
	let x    = item.RedT.x+1;
	let y    = item.RedT.y-1;
	let win  = true;
	while(win){
		let aY = this.matrix[y];
		if (aY !== void 0) {
			let a = this.matrix[y][x];
			if (a !== void 0 && a.RedT.type === item.RedT.type) {
				data.length++;
				data.last = a;
			}else{
				win = false;
			}
		}else{
			win = false;
		}
		x++;
		y--;
	}
	if (data.length >= 5) {
		return data;
	}
	return void 0;
}
Game.prototype.checWinRightBottom = function(item){
	let data = {rotate:45, player:item.RedT.type, length:1, first:item, last:null};
	let x    = item.RedT.x+1;
	let y    = item.RedT.y+1;
	let win  = true;
	while(win){
		let aY = this.matrix[y];
		if (aY !== void 0) {
			let a = this.matrix[y][x];
			if (a !== void 0 && a.RedT.type === item.RedT.type) {
				data.length++;
				data.last = a;
			}else{
				win = false;
			}
		}else{
			win = false;
		}
		x++;
		y++;
	}
	if (data.length >= 5) {
		return data;
	}
	return void 0;
}

Game.prototype.checWinTop = function(item){
	let data = {rotate:0, type: 'top', player:item.RedT.type, length:1, first:item, last:null};
	let y    = item.RedT.y-1;
	let win  = true;
	while(win){
		let aY = this.matrix[y];
		if (aY !== void 0) {
			let a = this.matrix[y][item.RedT.x];
			if (a !== void 0 && a.RedT.type === item.RedT.type) {
				data.length++;
				data.last = a;
			}else{
				win = false;
			}
		}else{
			win = false;
		}
		y--;
	}
	if (data.length >= 5) {
		return data;
	}
	return void 0;
}

Game.prototype.checWinBottom = function(item){
	let data = {rotate:0, type: 'bottom', player:item.RedT.type, length:1, first:item, last:null};
	let y    = item.RedT.y+1;
	let win  = true;
	while(win){
		let aY = this.matrix[y];
		if (aY !== void 0) {
			let a = this.matrix[y][item.RedT.x];
			if (a !== void 0 && a.RedT.type === item.RedT.type) {
				data.length++;
				data.last = a;
			}else{
				win = false;
			}
		}else{
			win = false;
		}
		y++;
	}
	if (data.length >= 5) {
		return data;
	}
	return void 0;
}


Game.prototype.play = function(){
	this.resetItemSelect();
	this.isPlay = true;
	this.changerStatus.innerText = 'Restart';
	this.gameBox.classList.add(this.arrPlay[this.player]);
}
Game.prototype.stop = function(){
	this.changerStatus.innerText = 'Start';
	this.isPlay = false;
	this.gameBox.classList.remove(this.arrPlay[0]);
	this.gameBox.classList.remove(this.arrPlay[1]);
}
Game.prototype.resetItemSelect = function(){
	this.itemSelect.forEach(function(item){
		item.RedT.type     = null;
		item.RedT.isActive = false;
		item.classList.remove('activeO');
		item.classList.remove('activeX');
	});
	this.itemSelect = [];
}

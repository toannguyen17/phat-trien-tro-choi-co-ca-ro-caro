
let Item = function(el, RedT, x, y) {
	this.x        = x;
	this.y        = y;
	this.type     = null;
	this.isActive = false;
	this.el       = el;
	this.RedT     = RedT;
	this.ripple   = this.el.querySelector('.ripple');
	this.init();
}
Item.prototype.init = function() {
	this.el.addEventListener('click',      this.eventClick.bind(this));
	this.el.addEventListener('touchstart', this.touchStart.bind(this));
	this.el.addEventListener('touchenter', this.touchEnter.bind(this));
	this.el.addEventListener('touchend',   this.touchEnd.bind(this));
}
Item.prototype.touchStart = function(e) {
	//console.log('start', e);
}
Item.prototype.touchEnter = function(e) {
	//console.log('start', e.target);
	this.eventClick();
}
Item.prototype.touchEnd = function(e) {
	//console.log('end', e);

}
Item.prototype.eventClick = function() {
	if (this.RedT.isPlay) {
		if (this.isActive === false) {
			this.isActive = true;
			if (this.RedT.player === 0) {
				this.el.classList.add('activeO');
			}else{
				this.el.classList.add('activeX');
			}
			this.type = this.RedT.player;
			this.RedT.itemSelect.push(this.el);
			this.RedT.changerPlayer();
		}
	}else{
		this.RedT.start();
	}
}
Item.prototype.destroy = function() {
}

function Animation(image, current_x, current_y, frame_width, frame_height, frameAddition) {
    this.image = image;
    
    this.frame_width = frame_width;
    this.frame_height = frame_height;
                
    this.current_x = current_x;
    this.current_y = current_y;
    this.change = true;
    this.frameAddition = frameAddition;
}
            
Animation.prototype.next = function() {
    
    if (this.change) 
        this.current_x += this.frameAddition;
    else
        this.current_x -= this.frameAddition;
    
    this.change = !this.change;
}
            
Animation.prototype.draw = function(context, xposition, yposition, width, height) {
    context.drawImage(this.image, this.current_x, this.current_y, 
                      this.frame_width, this.frame_height, 
                      xposition, yposition, 
                      width, height);
}
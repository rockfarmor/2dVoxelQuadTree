var GraphicsUi = function() {

    this.windows = [];
    this.mouseLeftDown = false;
    this.mouseLeftWasDown = false;
    this.graphicsUiStyle = new GraphicsUiStyle();

    this.draggedWindow = null;

    this.addWindow = function(x, y = 0, width = 0, height = 0, open = true, isStatic = true) {
        if (x instanceof GraphicsWindow)
            this.windows.push(x);
        else
            this.windows.push(new GraphicsWindow(x, y, width, height, open, isStatic));
    }

    this.setGraphicsUiStyle = function(gUiStyle) {
        this.graphicsUiStyle = gUiStyle;
    }

    this.dragWindow = function() {
        var id = this.clickedWindow();
        if (id >= 0 && !this.windows[id].static) {
            if (this.draggedWindow == null && this.windows[id].inBoundsTopbar(mouseX, mouseY))  {
                this.draggedWindow = {
                    win: this.windows[id],
                    offsetX: mouseX - this.windows[id].x,
                    offsetY: mouseY - this.windows[id].y
                };

            }
        }

        if (this.draggedWindow != null) {
            if (this.mouseLeftDown)  {
                this.draggedWindow.win.x = mouseX - this.draggedWindow.offsetX;
                this.draggedWindow.win.y = mouseY - this.draggedWindow.offsetY;

            } else {
                this.draggedWindow = null;
            }
        }
    }


    this.update = function() {
        this.mouseLeftDown = mouseIsPressed && mouseButton == LEFT;

        this.activeWindow();

        this.dragWindow();

        this.checkButtons();

        this.mouseLeftWasDown = this.mouseLeftDown;
    }

    this.checkButtons = function() {
        var clicked = this.mouseInWindow();
        if (clicked >= 0) {
            for (var i = 0; i < this.windows[clicked].buttons.length; i++) {
                if (this.mouseLeftDown)
                    this.windows[clicked].buttons[i].buttonDown(mouseX, mouseY);
            }
        }

    }

    this.draw = function() {
        push();
        for (var i = this.windows.length - 1; i >= 0; i--) {

            this.windows[i].draw(this.graphicsUiStyle);
        }
        pop();
    }

    this.mouseInWindow = function() {
        var id = -1;
        for (var i = this.windows.length - 1; i >= 0; i--) {
            if (this.windows[i].inBounds(mouseX, mouseY) && this.windows[i].opened) {
                id = i;
            }
        }
        return id;
    }

    this.clickedWindow = function() {
        var id = -1;
        for (var i = this.windows.length - 1; i >= 0; i--) {
            if (this.mouseLeftClicked()) {
                if (this.windows[i].inBounds(mouseX, mouseY) && this.windows[i].opened) {
                    id = i;
                }
            }
        }
        return id;
    }

    this.activeWindow = function() {
        var id = -1;
        for (var i = this.windows.length - 1; i >= 0; i--) {
            if (this.mouseLeftClicked()) {
                if (this.windows[i].inBounds(mouseX, mouseY) && this.windows[i].opened && !this.windows[i].static)
                    id = i;
            }
        }
        if (id != -1) {
            var win = this.windows[id];
            this.windows.splice(id, 1);
            this.windows.unshift(win);
        }
    }


    this.mouseLeftClicked = function() {
        return this.mouseLeftDown && !this.mouseLeftWasDown;
    }
}

var GraphicsUiStyle = function() {
    this.backgroundColor = color(50, 0, 0, 255);
    this.font = "Helvetica";

    this.backgroundStroke = color(0, 0, 0, 255);
    this.noBackgroundStroke = false;

    this.buttonColor = color(140, 40, 40);
    this.buttonStroke = color(0, 0, 0, 255);
    this.noButtonStroke = false;


    /*
     * Can be a preloaded p5.Font or a string with a preloaded font,
     * "Helvetica" for an exmaple
     */
    this.setFont = function(font) {
        this.font = font;
    }

    this.setButtonColor = function(r, g = 0, b = 0, a = 255) {
        if (r instanceof p5.Color) {
            this.buttonColor = r;
        } else {
            this.buttonColor = color(r, g, b, a);
        }
    }

    this.setButtonStroke = function(r, g = 0, b = 0, a = 255) {
        if (r instanceof p5.Color) {
            this.buttonStroke = r;
        } else {
            this.buttonStroke = color(r, g, b, a);
        }

    }

    /*
     * Sets the stroke color, can be a p5.Color or 1-4 arguments with
     * values between 0 and 255;
     */
    this.setBackgroundStroke = function(r, g = 0, b = 0, a = 255) {
        if (r instanceof p5.Color) {
            this.backgroundStroke = r;
        } else {
            this.backgroundStroke = color(r, g, b, a);
        }

    }


    /*
     * Sets the background color, can be a p5.Color or 1-4 arguments with
     * values between 0 and 255;
     */
    this.setBackgroundColor = function(r, g = 0, b = 0, a = 255) {
        if (r instanceof p5.Color) {
            this.backgroundColor = r;
        } else {
            this.backgroundColor = color(r, g, b, a);
        }

    }


}

var GraphicsWindow = function(x, y, width, height, open = true, isStatic = true) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.static = isStatic;
    this.opened = open;
    this.topbar = false;
    this.topbarHeight = 40;
    this.title = "windowTitle";

    this.buttons = [];
    this.textFields = [];

    this.addButton = function(x, y, width, height, func = null) {
        var but = new GraphicsButton(x, y, width, height, func, this);
        this.buttons.push(but);
        return but;
    }

    this.addTextfield = function(text, x, y, width = -1, height = -1) {
        var tField = new GraphicsTextField(text, x, y, width, height, this)
        this.textFields.push(tField);
        return tField;
    }

    this.open = function() {
        this.opened = true;
    }

    this.close = function() {
        this.opened = false;
    }


    this.inBounds = function(x, y) {
        return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
    }

    this.inBoundsTopbar = function(x, y) {
        if (!this.topbar) return false;
        return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.topbarHeight;
    }


    this.update = function() {

    }

    this.draw = function(gStyle) {
        if (this.opened)  {
            if (gStyle.noBackgroundStroke) {
                noStroke();
            } else {
                stroke(gStyle.backgroundStroke);
            }
            fill(gStyle.backgroundColor);
            rect(this.x, this.y, this.width, this.height);

            if (this.topbar) {
                if (this.inBoundsTopbar(mouseX, mouseY))
                    cursor(MOVE);
                fill(0, 0, 0, 100);
                noStroke();
                rect(this.x + 1, this.y + 1, this.width - 1, this.topbarHeight);
                fill(255)
                textAlign(LEFT, CENTER)
                text(this.title, this.x + 10, this.y, this.width - 10, this.topbarHeight);
            }

            for (var i = 0; i < this.buttons.length; i++) {
                this.buttons[i].draw(gStyle);
            }

            for (var i = 0; i < this.textFields.length; i++) {
                this.textFields[i].draw(gStyle);
            }



        }
    }
}

var GraphicsButton = function(x, y, width, height, func = null, parent = null) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.func = func;
    this.parent = parent;
    this.down = false;
    this.wasDown = false;

    this.buttonDown = function(x, y) {
        if (this.inBounds(x, y)) {
            this.down = true;

        } else {
            this.down = false;
        }
    }

    this.clicked = function(x, y) {
        if (this.down == false && this.wasDown == true) {
            if (this.func != null) {
                this.func();
            } else {
                console.log("Button clicked")
            }
        }
    }

    this.inBounds = function(x, y) {
        var offsetX = 0;
        var offsetY = 0;
        if (parent != null) {
            offsetX = parent.x;
            offsetY = parent.y;
        }
        return x >= this.x + offsetX && x < this.x + offsetX + this.width && y >= this.y + offsetY && y < this.y + offsetY + this.height;
    }

    this.draw = function(gStyle) {
        this.clicked();
        if (this.inBounds(mouseX, mouseY)){
            cursor(HAND);
        }


        var offsetX = 0;
        var offsetY = 0;
        var offsetWidth = 0;
        var offsetHeight = 0;
        if (parent != null) {
            offsetX = parent.x;
            offsetY = parent.y;
        }
        if (gStyle.noButtonStroke)
            noStroke()
        else
            stroke(gStyle.buttonStroke);
        var col = this.color;
        if (this.color == null)
            col = gStyle.buttonColor;
        else
            col = this.color;

        if (!this.down)
            fill(col);
        else {
            fill(red(col) * 3/4, green(col) * 3/4, blue(col) * 3/4, alpha(col))
            offsetX += 1;
            offsetY += 1;
            offsetWidth -= 2;
            offsetHeight -= 2;
        }
        rect(this.x + offsetX, this.y + offsetY, this.width + offsetWidth, this.height + offsetHeight);

        this.wasDown = this.down;
        this.down = false;
    }

}

var GraphicsTextField = function(textt, x, y, width = -1, height = -1, parent = null){
    this.x = x;
    this.y = y;
    this.text = textt;
    this.width = width;
    this.height = height;
    this.font = null;
    this.color = null;
    this.parent = parent;
    this.debug = true;

    this.addText = function(text){
        this.text += text;
    }

    this.updateText = function(text){
        this.text = text;
    }

    this.draw = function(gStyle){
        var offsetX = 0;
        var offsetY = 0;
        if (parent != null) {
            offsetX = parent.x;
            offsetY = parent.y;
        }
        if (this.debug){
            fill(50,50,50,50);
            rect(this.x + offsetX, this.y + offsetY, this.width, this.height)
        }
        if (this.color == null)
            fill(50);
        else
            fill(this.color);


        textAlign(LEFT, TOP)
        if (this.width <= 0 || this.height <= 0){
            text(this.text, this.x + offsetX, this.y + offsetY);
        } else {
            text(this.text, this.x + offsetX, this.y + offsetY, this.width, this.height);
        }
    }








}






function hexToP5Color(h) {
    return color(hexToR(h), hexToG(h), hexToB(h));
}

function hexToR(h) {
    return parseInt((cutHex(h)).substring(0, 2), 16)
}

function hexToG(h) {
    return parseInt((cutHex(h)).substring(2, 4), 16)
}

function hexToB(h) {
    return parseInt((cutHex(h)).substring(4, 6), 16)
}

function cutHex(h) {
    return (h.charAt(0) == "#") ? h.substring(1, 7) : h
}

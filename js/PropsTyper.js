class PropsTyper {

    constructor(resources, canvas) {

        this.resources = resources;
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");

        this.intervalID = null;
        this.charCounter = -1;
        this.wait = false;
        this.halt = false;
        this.isDone = false;

        this.props = resources.getProps();
        this.props2 = resources.getProps2();
        this.propsHeader = [];

        this.currentFX = null;

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.messagesArray = [];
        this.currentMessage = 0;
        this.currentChar = 0;
        this.charWidth = 0;
        this.charHeight = 0;
        this.offsetX = 0;
        this.props2OffsetX = 0;

        this.propsYPos;

        // this.endSplash = resources.getTexture(6);

        this.flashCounter = 0;
        this.flashMax = 6;
        this.isFlash = false;
        this.showHeader = false;
        this.blinkHeader = false;
        this.flashMode = false;

        this.setMessagesArray(resources);
        
        this.currentBillboard = this.messagesArray[this.currentMessage];

        var propW = this.currentBillboard[this.currentChar].width;
        this.alignProp(this.currentBillboard.length * propW);
    }

    setMessagesArray(resources) {

        var prop;
        var message;
        var bmp;

        for(var i = 0; i < this.props.length; i++) {

            prop = this.props[i].split('');
            message = [];
            for(var j = 0; j < prop.length; j++) {

                if(!resources.getChar(prop[j])) continue;

                bmp = resources.getChar(prop[j]).clone();
                bmp.imageDataInverted = Utils.invertImage(resources.getChar(prop[j]).clone().imageData);
                message.push(bmp);
            }
            this.messagesArray.push(message);
        }
        this.charWidth = bmp.width;
        this.propsYPos = this.height - bmp.height;

        var props2STR = this.props2.split('');
        for(var i = 0; i < props2STR.length; i++) {

            if(!resources.getChar(props2STR[i])) continue;

            bmp = resources.getChar(props2STR[i]).clone();
            bmp.imageDataInverted = Utils.invertImage(resources.getChar(props2STR[i]).clone().imageData);
            this.propsHeader.push(bmp);
        }

        this.props2OffsetX = (this.width / 2) - ((this.propsHeader.length * bmp.width) / 2);
    }

    resetCanvas(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        var propW = this.currentBillboard[this.currentChar].width;
        this.alignProp(this.currentBillboard.length * propW);
    }

    update() {

        if(this.isDone) return;

        if(this.flashMode) {

            this.flashPropsTyper();
            return;
        }

        var bmp;
        var posX;
        if(this.showHeader) {
             for(var i = 0; i < this.propsHeader.length; i++) {
                bmp = this.propsHeader[i];
                posX = (i * bmp.width);
                if(!this.blinkHeader) {
                    this.context.putImageData(bmp.imageData, posX + this.props2OffsetX, 0);
                } else {
                    this.context.putImageData(bmp.imageDataInverted, posX + this.props2OffsetX, 0);
                }
            }
        }

        if(this.halt) return;

        for(var i = 0; i < this.currentBillboard.length; i++) {

            if(this.currentChar === -1 || i > this.currentChar) break;

            bmp = this.currentBillboard[i];
            posX = (i * bmp.width) + this.offsetX;

            if(!this.isFlash) {
                this.context.putImageData(bmp.imageData, posX, this.propsYPos);
            } else {
                this.context.putImageData(bmp.imageDataInverted, posX, this.propsYPos);
            }
        }
    }

    flashPropsTyper() {

        var bmp;
        var posX;
        if(this.showHeader) {
             for(var i = 0; i < this.propsHeader.length; i++) {
                bmp = this.propsHeader[i];
                posX = (i * bmp.width);
                if(!this.blinkHeader) {
                    this.context.putImageData(bmp.imageData, posX + this.props2OffsetX, 0);
                } else {
                    this.context.putImageData(bmp.imageDataInverted, posX + this.props2OffsetX, 0);
                }
            }
        }

        var barr = this.messagesArray[this.messagesArray.length - 1];
        for(var i = 0; i < barr.length; i++) {

            bmp = barr[i];
            posX = (i * bmp.width) + this.offsetX;

            if(!this.isFlash) {
                this.context.putImageData(bmp.imageData, posX, this.propsYPos);
            } else {
                this.context.putImageData(bmp.imageDataInverted, posX, this.propsYPos);
            }
        }
    }

    end() {

        window.clearTimeout(this.intervalID);
        this.halt = true;
        this.isDone = true;
        this.context.clearRect(0, 0, this.width, this.height);
    }

    alignProp(propW) {
        this.offsetX = (this.width / 2) - (propW / 2);
    }

    updateProp(e) {

        if(this.flashMode) return;

        if(!this.wait) {
            this.wait = true;
            var instance = this;
            this.intervalID = window.setTimeout(function() {
                window.clearTimeout(instance.intervalID);

                instance.intervalID = null;
                instance.currentChar++;
                if(instance.currentChar >= instance.currentBillboard.length) {

                    if(instance.flashCounter === instance.flashMax) {
                        instance.isFlash = false;
                        instance.flashCounter = 0;
                        instance.currentChar = 0;
                        instance.currentMessage++;
                        if(instance.currentMessage >= instance.messagesArray.length) {
                            instance.flashMode = true;
                            instance.currentMessage = 0;
                            return;
                        }

                        if(instance.currentMessage === 5) {
                            instance.halt = true;
                        }

                        instance.currentBillboard = instance.messagesArray[instance.currentMessage];
                        instance.alignProp(instance.currentBillboard.length * instance.charWidth)

                    } else {

                        instance.flashCounter++;
                        instance.isFlash = !instance.isFlash;
                    }
                }

                instance.wait = false;
            }, 100);
        }
    }

    updateHeader(data) {
        this.blinkHeader = data;
        if(this.flashMode) {
            this.isFlash = data;
        }
    }

    setCurrentFX(FXID) {

        switch(FXID){

            case Resources.FX.FX01:
                this.halt = false;
                break;

            case Resources.FX.FX05:
                this.halt = true;
                break;

            case Resources.FX.FX08:
                this.showHeader = true;
                this.halt = false;
                this.currentChar = -1;
                break;
            case Resources.FX.FX09:
                this.showHeader = true;
                break;
            case Resources.FX.FX10:
                this.showHeader = true;
                break;
            case Resources.FX.FX11:
                this.showHeader = false;
                this.isDone = true;
                break;
        }
    }
}
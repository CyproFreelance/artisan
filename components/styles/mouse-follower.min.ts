class MouseFollower {
    options: {
        el: string | HTMLElement;
        container: string | HTMLElement;
        className: string;
        innerClassName: string;
        textClassName: string;
        mediaClassName: string;
        mediaBoxClassName: string;
        iconSvgClassName: string;
        iconSvgNamePrefix: string;
        iconSvgSrc: string;
        dataAttr: string;
        hiddenState: string;
        textState: string;
        iconState: string;
        activeState: string;
        mediaState: string;
        stateDetection: { [key: string]: string };
        visible: boolean;
        visibleOnState: boolean;
        speed: number;
        ease: string;
        overwrite: boolean;
        skewing: number;
        skewingText: number;
        skewingIcon: number;
        skewingMedia: number;
        skewingDelta: number;
        skewingDeltaMax: number;
        stickDelta: number;
        showTimeout: number;
        hideOnLeave: boolean;
        hideTimeout: number;
        hideMediaTimeout: number;
        initialPos: [number, number];
    };
    gsap: any;
    el: HTMLElement | null;
    container: HTMLElement | null;
    skewing: number;
    pos: { x: number; y: number; };
    vel: { x: number; y: number; };
    event: any;
    events: any[];
    ticker: any;
    visibleInt: any;
    mediaInt: any;
    stick: any;
    text: HTMLElement;
    inner: HTMLElement;
    media: HTMLElement;
    mediaBox: HTMLElement;
    mediaImg: HTMLImageElement | null;
    mediaVideo: HTMLVideoElement | null;
    setter: {
        x: (value: number) => void;
        y: (value: number) => void;
        rotation: (value: number) => void;
        scaleX: (value: number) => void;
        scaleY: (value: number) => void;
        wc: (value: string) => void;
        inner: { rotation: (value: number) => void; };
    };

    constructor(options: any = {}) {
        this.options = Object.assign(
            {},
            {
                el: null,
                container: document.body,
                className: "mf-cursor",
                innerClassName: "mf-cursor-inner",
                textClassName: "mf-cursor-text",
                mediaClassName: "mf-cursor-media",
                mediaBoxClassName: "mf-cursor-media-box",
                iconSvgClassName: "mf-svgsprite",
                iconSvgNamePrefix: "-",
                iconSvgSrc: "",
                dataAttr: "cursor",
                hiddenState: "-hidden",
                textState: "-text",
                iconState: "-icon",
                activeState: "-active",
                mediaState: "-media",
                stateDetection: { "-pointer": "a,button" },
                visible: true,
                visibleOnState: false,
                speed: 0.55,
                ease: "expo.out",
                overwrite: true,
                skewing: 0,
                skewingText: 2,
                skewingIcon: 2,
                skewingMedia: 2,
                skewingDelta: 0.001,
                skewingDeltaMax: 0.15,
                stickDelta: 0.15,
                showTimeout: 0,
                hideOnLeave: true,
                hideTimeout: 300,
                hideMediaTimeout: 300,
                initialPos: [-window.innerWidth, -window.innerHeight],
            },
            options
        );
        if (this.options.visible && !options.stateDetection) {
            this.options.stateDetection["-hidden"] = "iframe";
        }
        this.gsap = MouseFollower.gsap || window.gsap;
        this.el =
            typeof this.options.el === "string"
                ? document.querySelector(this.options.el)
                : this.options.el;
        this.container =
            typeof this.options.container === "string"
                ? document.querySelector(this.options.container)
                : this.options.container;
        this.skewing = this.options.skewing;
        this.pos = { x: this.options.initialPos[0], y: this.options.initialPos[1] };
        this.vel = { x: 0, y: 0 };
        this.event = {};
        this.events = [];
        this.init();
    }

    static registerGSAP(gsap: any) {
        MouseFollower.gsap = gsap;
    }

    init() {
        this.el || this.create();
        this.createSetter();
        this.bind();
        this.render(true);
        this.ticker = this.render.bind(this, false);
        this.gsap.ticker.add(this.ticker);
    }

    create() {
        this.el = document.createElement("div");
        this.el.className = this.options.className;
        this.el.classList.add(this.options.hiddenState);
        this.inner = document.createElement("div");
        this.inner.className = this.options.innerClassName;
        this.text = document.createElement("div");
        this.text.className = this.options.textClassName;
        this.media = document.createElement("div");
        this.media.className = this.options.mediaClassName;
        this.mediaBox = document.createElement("div");
        this.mediaBox.className = this.options.mediaBoxClassName;
        this.media.appendChild(this.mediaBox);
        this.inner.appendChild(this.media);
        this.inner.appendChild(this.text);
        this.el.appendChild(this.inner);
        this.container.appendChild(this.el);
    }

    createSetter() {
        this.setter = {
            x: this.gsap.quickSetter(this.el, "x", "px"),
            y: this.gsap.quickSetter(this.el, "y", "px"),
            rotation: this.gsap.quickSetter(this.el, "rotation", "deg"),
            scaleX: this.gsap.quickSetter(this.el, "scaleX"),
            scaleY: this.gsap.quickSetter(this.el, "scaleY"),
            wc: this.gsap.quickSetter(this.el, "willChange"),
            inner: {
                rotation: this.gsap.quickSetter(this.inner, "rotation", "deg"),
            },
        };
    }

    bind() {
        this.event.mouseleave = () => this.hide();
        this.event.mouseenter = () => this.show();
        this.event.mousedown = () => this.addState(this.options.activeState);
        this.event.mouseup = () => this.removeState(this.options.activeState);
        this.event.mousemoveOnce = () => this.show();
        this.event.mousemove = (e: MouseEvent) => {
            this.gsap.to(this.pos, {
                x: this.stick
                    ? this.stick.x - (this.stick.x - e.clientX) * this.options.stickDelta
                    : e.clientX,
                y: this.stick
                    ? this.stick.y - (this.stick.y - e.clientY) * this.options.stickDelta
                    : e.clientY,
                overwrite: this.options.overwrite,
                ease: this.options.ease,
                duration: this.visible ? this.options.speed : 0,
                onUpdate: () => {
                    this.vel = {
                        x: e.clientX - this.pos.x,
                        y: e.clientY - this.pos.y,
                    };
                },
            });
        };
        this.event.mouseover = (e: MouseEvent) => {
            for (
                let i = e.target as HTMLElement;
                i &&
                i !== this.container &&
                (!e.relatedTarget || !i.contains(e.relatedTarget));
                i = i.parentNode as HTMLElement
            ) {
                for (let s in this.options.stateDetection)
                    i.matches(this.options.stateDetection[s]) && this.addState(s);
                if (this.options.dataAttr) {
                    let n = this.getFromDataset(i);
                    n.state && this.addState(n.state),
                        n.text && this.setText(n.text),
                        n.icon && this.setIcon(n.icon),
                        n.img && this.setImg(n.img),
                        n.video && this.setVideo(n.video),
                        n.show !== undefined && this.show(),
                        n.stick !== undefined && this.setStick(n.stick || i);
                }
            }
        };
        this.event.mouseout = (e: MouseEvent) => {
            for (
                let i = e.target as HTMLElement;
                i &&
                i !== this.container &&
                (!e.relatedTarget || !i.contains(e.relatedTarget));
                i = i.parentNode as HTMLElement
            ) {
                for (let s in this.options.stateDetection)
                    i.matches(this.options.stateDetection[s]) && this.removeState(s);
                if (this.options.dataAttr) {
                    let n = this.getFromDataset(i);
                    n.state && this.removeState(n.state),
                        n.text && this.removeText(),
                        n.icon && this.removeIcon(),
                        n.img && this.removeImg(),
                        n.video && this.removeVideo(),
                        n.show !== undefined && this.hide(),
                        n.stick !== undefined && this.removeStick();
                }
            }
        };
        this.options.hideOnLeave &&
            this.container.addEventListener("mouseleave", this.event.mouseleave, { passive: true });
        this.options.visible &&
            this.container.addEventListener("mouseenter", this.event.mouseenter, { passive: true });
        this.options.activeState &&
            (this.container.addEventListener("mousedown", this.event.mousedown, { passive: true }),
            this.container.addEventListener("mouseup", this.event.mouseup, { passive: true }));
        this.container.addEventListener("mousemove", this.event.mousemove, { passive: true });
        this.options.visible &&
            this.container.addEventListener("mousemove", this.event.mousemoveOnce, {
                passive: true,
                once: true,
            });
        (this.options.stateDetection || this.options.dataAttr) &&
            (this.container.addEventListener("mouseover", this.event.mouseover, { passive: true }),
            this.container.addEventListener("mouseout", this.event.mouseout, { passive: true }));
    }

    render(force: boolean) {
        if (force || (this.vel.y !== 0 && this.vel.x !== 0)) {
            this.trigger("render");
            this.setter.wc("transform");
            this.setter.x(this.pos.x);
            this.setter.y(this.pos.y);
            if (this.skewing) {
                let e = Math.sqrt(Math.pow(this.vel.x, 2) + Math.pow(this.vel.y, 2));
                let i = Math.min(e * this.options.skewingDelta, this.options.skewingDeltaMax) * this.skewing;
                let s = (180 * Math.atan2(this.vel.y, this.vel.x)) / Math.PI;
                this.setter.rotation(s);
                this.setter.scaleX(1 + i);
                this.setter.scaleY(1 - i);
                this.setter.inner.rotation(-s);
            }
        } else {
            this.setter.wc("auto");
        }
    }

    show() {
        clearInterval(this.visibleInt);
        this.visibleInt = setTimeout(() => {
            this.el!.classList.remove(this.options.hiddenState);
            this.visible = true;
            this.render(true);
        }, this.options.showTimeout);
    }

    hide() {
        clearInterval(this.visibleInt);
        this.el!.classList.add(this.options.hiddenState);
        this.visibleInt = setTimeout(() => (this.visible = false), this.options.hideTimeout);
    }

    toggle(t: boolean) {
        if (t || (!t && !this.visible)) this.show();
        else this.hide();
    }

    addState(t: string) {
        this.trigger("addState", t);
        if (t === this.options.hiddenState) this.hide();
        else {
            this.el!.classList.add(...t.split(" "));
            if (this.options.visibleOnState) this.show();
        }
    }

    removeState(t: string) {
        this.trigger("removeState", t);
        if (t === this.options.hiddenState) this.show();
        else {
            this.el!.classList.remove(...t.split(" "));
            if (this.options.visibleOnState && this.el!.className === this.options.className) this.hide();
        }
    }

    toggleState(t: string, e: boolean) {
        if (e || (!e && !this.el!.classList.contains(t))) this.addState(t);
        else this.removeState(t);
    }

    setSkewing(t: number) {
        this.gsap.to(this, { skewing: t });
    }

    removeSkewing() {
        this.gsap.to(this, { skewing: this.options.skewing });
    }

    setStick(t: string | HTMLElement) {
        let e = typeof t === "string" ? document.querySelector(t) : t;
        let bounds = e.getBoundingClientRect();
        this.stick = { y: bounds.top + bounds.height / 2, x: bounds.left + bounds.width / 2 };
    }

    removeStick() {
        this.stick = null;
    }

    setText(t: string) {
        this.text.innerHTML = t;
        this.addState(this.options.textState);
        this.setSkewing(this.options.skewingText);
    }

    removeText() {
        this.removeState(this.options.textState);
        this.removeSkewing();
    }

    setIcon(t: string, e: string = "") {
        this.text.innerHTML = `<svg class='${this.options.iconSvgClassName} ${this.options.iconSvgNamePrefix}${t}' style='${e}'><use xlink:href='${this.options.iconSvgSrc}#${t}'></use></svg>`;
        this.addState(this.options.iconState);
        this.setSkewing(this.options.skewingIcon);
    }

    removeIcon() {
        this.removeState(this.options.iconState);
        this.removeSkewing();
    }

    setMedia(t: HTMLElement) {
        clearTimeout(this.mediaInt);
        if (t) {
            this.mediaBox.innerHTML = "";
            this.mediaBox.appendChild(t);
        }
        this.mediaInt = setTimeout(() => this.addState(this.options.mediaState), 20);
        this.setSkewing(this.options.skewingMedia);
    }

    removeMedia() {
        clearTimeout(this.mediaInt);
        this.removeState(this.options.mediaState);
        this.mediaInt = setTimeout(() => (this.mediaBox.innerHTML = ""), this.options.hideMediaTimeout);
        this.removeSkewing();
    }

    setImg(t: string) {
        if (!this.mediaImg) this.mediaImg = new Image();
        if (this.mediaImg.src !== t) this.mediaImg.src = t;
        this.setMedia(this.mediaImg);
    }

    removeImg() {
        this.removeMedia();
    }

    setVideo(t: string) {
        if (!this.mediaVideo) {
            this.mediaVideo = document.createElement("video");
            this.mediaVideo.muted = true;
            this.mediaVideo.loop = true;
            this.mediaVideo.autoplay = true;
        }
        if (this.mediaVideo.src !== t) {
            this.mediaVideo.src = t;
            this.mediaVideo.load();
        }
        this.mediaVideo.play();
        this.setMedia(this.mediaVideo);
    }

    removeVideo() {
        if (this.mediaVideo && this.mediaVideo.readyState > 2) this.mediaVideo.pause();
        this.removeMedia();
    }

    on(t: string, e: any) {
        this.events[t] instanceof Array || this.off(t);
        this.events[t].push(e);
    }

    off(t: string, e?: any) {
        this.events[t] = e
            ? this.events[t].filter((t: any) => {
                return t !== e;
            })
            : [];
    }

    trigger(t: string) {
        let args = arguments;
        let self = this;
        if (this.events[t]) {
            this.events[t].forEach((func: any) => {
                func.call(self, self, ...[].slice.call(args, 1));
            });
        }
    }

    getFromDataset(t: HTMLElement) {
        let e = t.dataset;
        return {
            state: e[this.options.dataAttr],
            show: e[this.options.dataAttr + "Show"],
            text: e[this.options.dataAttr + "Text"],
            icon: e[this.options.dataAttr + "Icon"],
            img: e[this.options.dataAttr + "Img"],
            video: e[this.options.dataAttr + "Video"],
            stick: e[this.options.dataAttr + "Stick"],
        };
    }

    destroy() {
        this.trigger("destroy");
        this.gsap.ticker.remove(this.ticker);
        this.container!.removeEventListener("mouseleave", this.event.mouseleave);
        this.container!.removeEventListener("mouseenter", this.event.mouseenter);
        this.container!.removeEventListener("mousedown", this.event.mousedown);
        this.container!.removeEventListener("mouseup", this.event.mouseup);
        this.container!.removeEventListener("mousemove", this.event.mousemove);
        this.container!.removeEventListener("mousemove", this.event.mousemoveOnce);
        this.container!.removeEventListener("mouseover", this.event.mouseover);
        this.container!.removeEventListener("mouseout", this.event.mouseout);
        if (this.el) {
            this.container!.removeChild(this.el);
            this.el = null;
            this.mediaImg = null;
            this.mediaVideo = null;
        }
    }
}

export default MouseFollower;

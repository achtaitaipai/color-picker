export function ColorPickerStyle() {
	const style = document.createElement('style')
	style.textContent = /*css*/ `
            :host {
				display:flex;
				flex-direction: column;
				align-items: center;
                position: relative;
                padding:.5rem;
                gap:.7rem;
                background-color:var(--bg,#3f3e3e);
                border-radius:0.3125rem;
                display:none;
                z-index:10;
            }
            .picker{
                width:100%;
                height:auto;
                aspect-ratio:1;
                background-color: #ff0000;
                position:relative;
                cursor:pointer;
            }
            .picker::after{
                content:"";
                position:absolute;
                inset:0;
                background-image: linear-gradient(to right, #fff, rgba(204, 154, 129, 0));
            }
            .picker::before{
                content:"";
                position:absolute;
                inset:0;
                z-index:1;
                background-image: linear-gradient(to top, #000, rgba(204, 154, 129, 0));
            }
            .picker_cursor{
                position:absolute;
                width:.6rem;
                height:.6rem;
                border-radius:50%;
                border:2px solid #fff;
                mix-blend-mode:difference;
                left:100%;
                transform:translate(-50%,-50%);
                z-index:2;
            }
            .range-wrapper{
                display:flex;
                align-items:center;
                justify-content:space-between;
                width:100%;
                gap:.5rem;
            }
            .hueRange{
				-webkit-appearance :none;
                width:100%;
                height:.8rem;
                outline: 0;
                border-radius:0.5rem;
                box-sizing:border-box;
                background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
                cursor:pointer;
				padding:0;
            }
            .hueRange:focus{
                outline:1px solid;
            }
            .preview{
                width:1.5rem;
                height:auto;
                aspect-ratio:1;
                outline:1px solid white;
            }
            input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                border: 2px solid #ffff;
                height: 1rem;
                width: .35rem;
                background: transparent;
                cursor: pointer;
              }
              
              input[type=range]::-moz-range-thumb {
                -webkit-appearance: none;
                border: 2px solid #ffff;
                height: 1rem;
                width: .35rem;
                background: transparent;
                cursor: pointer;
              }
			  .pallet{
				  width:100%;
                display:grid;
                grid-template-columns:repeat(8,1fr);
                align-content:center;
				gap:.2rem;
            }
            .colorBtn{
                display: none;
            }
            .colorLabel{
                cursor:pointer;
                border-radius:0.125rem;
				width:100%;
				height:auto;
				aspect-ratio:69 / 69;
            }
            .colorLabel:hover,.colorLabel:focus{
                transform:scale(1.1);
            }
            .colorBtn:checked + .colorLabel{
                outline:1px solid white;
                outline-offset: 1px;
            }
            .hexInput{
                grid-row:2;
                grid-column:2 / -1;
                display:block;
                width:100%;
                margin:0;
                box-sizing:border-box;
                background-color:var(--bg-input,#282828);
                color:var(--font-color,white);
                font-size:.8em;
                border:0;
                padding:.4rem;
            }
            .hexInput.error{
                background-color: var(--bg-error,#7b0000);
            }
            .btns{
                display:flex;
                width:100%;
                gap:.3125rem;
            }
            .btns_ok,.btns_cancel{
                width:100%;
                cursor:pointer;
                background-color:var(--bg-input,#282828);
                color:var(--font-color,white);
                border:0;
                padding:0.2rem;
            }
        `
	return style
}

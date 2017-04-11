// ViewMask.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';

import vs from '../shaders/pbr.vert';
import fs from '../shaders/mask.frag';

class ViewMask extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('mask');

		this.roughness = 1;
		this.specular = 0;
		this.metallic = 0;
		this.baseColor = [1, 1, 1];

		gui.add(this, 'specular', 0, 1);


		this._textureAO = Assets.get('mask_ao');
		this._textureColor = Assets.get('mask_albedo');
		this._textureRoughness = Assets.get('mask_roughness');
		this._textureMetalness = Assets.get('mask_metalness');
		this._textureNormal = Assets.get('mask_normal');

		this.shader.bind();

		this.shader.uniform('uColorMap', 'uniform1i', 0);
		this.shader.uniform('uAoMap', 'uniform1i', 1);
		this.shader.uniform('uRoughnessMap', 'uniform1i', 2);
		this.shader.uniform('uMetalMap', 'uniform1i', 3);
		this.shader.uniform('uNormalMap', 'uniform1i', 4);

		this.shader.uniform('uRadianceMap', 'uniform1i', 5);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 6);
	}


	render(textureRad, textureIrr) {

		this.shader.bind();

		this._textureColor.bind(0);
		this._textureAO.bind(1);
		this._textureRoughness.bind(2);
		this._textureMetalness.bind(3);
		this._textureNormal.bind(4);
		
		textureRad.bind(5);
		textureIrr.bind(6);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);

		GL.draw(this.mesh);
	}


}

export default ViewMask;
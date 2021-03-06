// save.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aExtra;
attribute vec2 aMapUV;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vExtra;
varying vec2 vMapUV;

void main(void) {
	vColor       = aVertexPosition;
	vec3 pos     = vec3(aTextureCoord, 0.0);
	gl_Position  = vec4(pos, 1.0);
	
	gl_PointSize = 1.0;
	
	vNormal      = aNormal;
	vExtra       = aExtra;
	vMapUV 			 = aMapUV;
}
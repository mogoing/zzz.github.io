attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_MVPMatrix;
uniform float u_heightOffset;
uniform float u_textureScale;
uniform float u_textureWidthScale;
uniform vec3 u_fadePosition;

#ifdef GL_ES
varying highp vec2 v_texCoord;
varying highp vec2 v_pos;
#else
varying vec2 v_texCoord;
varying vec2 v_pos;
#endif

void main()
{
	float addY = mix(0.4*u_textureScale, -0.7*u_textureScale, a_position.z);

	gl_Position = u_MVPMatrix * vec4(a_position.x, a_position.y + addY + u_heightOffset, 0.0, 1.0);
    v_texCoord.x = a_texCoord.x*u_textureWidthScale/u_textureScale;
	v_texCoord.y = a_position.z;
	v_pos = vec2(a_position.x, a_position.y + addY + u_heightOffset) - u_fadePosition.xy;
}

attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_MVPMatrix;
uniform float u_terrainBottom;

uniform vec3 u_fadePosition;

#ifdef GL_ES
varying highp vec2 v_texCoord;
varying highp float v_texCoord2;
varying highp vec2 v_pos;
#else
varying vec2 v_texCoord;
varying float v_texCoord2;
varying vec2 v_pos;
#endif

void main()
{
    float addY = max((a_position.y - u_terrainBottom)*a_position.z, 0.0);
    gl_Position = u_MVPMatrix * vec4(a_position.x, a_position.y - addY, 0.0, 1.0);
    v_texCoord.x = a_texCoord.x;
	v_texCoord.y = -(a_texCoord.y - addY / 10.0);
	v_texCoord *= 2.0;
	v_texCoord2 = addY / 20.0;
	v_pos = vec2(a_position.x, a_position.y - addY) - u_fadePosition.xy;
}


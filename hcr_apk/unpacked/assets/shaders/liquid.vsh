attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_MVPMatrix;
uniform float u_pointsize;

#ifdef GL_ES
varying mediump vec2 v_velocity;
#else
varying vec2 v_velocity;
#endif

void main()
{
    gl_Position = u_MVPMatrix * vec4(a_position, 0.0, 1.0);
	gl_PointSize = u_pointsize;
	v_velocity = a_texCoord;
}

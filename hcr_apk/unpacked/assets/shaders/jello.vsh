attribute vec2 a_position;
attribute vec2 a_texCoord;
attribute vec4 a_positionLR;
attribute vec4 a_positionUD;

uniform mat4 u_MVPMatrix;

#ifdef GL_ES
varying mediump vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif

void main()
{
    gl_Position = u_MVPMatrix * vec4(a_position/*0.5*(a_position + a_neighbour)*/, 0.0, 1.0);
    v_texCoord = a_texCoord;
}

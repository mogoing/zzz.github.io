attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec4 a_color;

uniform mat4 u_MVPMatrix;

#ifdef GL_ES
varying lowp vec3 v_fragmentColor;
varying mediump vec2 v_texCoord;
#else
varying vec3 v_fragmentColor;
varying vec2 v_texCoord;
#endif

const mat3 RGBtoYUV = mat3( 0.299, -0.168,  0.500,
							0.587, -0.331, -0.419,
							0.114,  0.500, -0.081 );

void main()
{
    gl_Position = u_MVPMatrix * a_position;
	v_fragmentColor = 0.75*RGBtoYUV * a_color.rgb;
    v_texCoord = a_texCoord;
}


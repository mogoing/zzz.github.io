#ifdef GL_ES
precision lowp float;
#endif

varying vec3 v_fragmentColor;
varying vec2 v_texCoord;
uniform sampler2D u_texture;

/*const mat3 RGBtoYUV = mat3( 0.299, -0.168,  0.500,
							0.587, -0.331, -0.419,
							0.114,  0.500, -0.081 );
*/
const mat3 YUVtoRGB = mat3( 1.000,  1.000, 1.000,
							0.000, -0.344, 1.772,
							1.402, -0.714, 0.000 );

void main()
{
	vec4 tex = texture2D(u_texture, v_texCoord);
	vec3 YUV = vec3(0.299*tex.r + 0.587*tex.g + 0.114*tex.b, v_fragmentColor.yz);
	vec3 RGB = YUVtoRGB * YUV;

    gl_FragColor = tex.a*vec4(RGB, 1.0);
}


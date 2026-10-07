#ifdef GL_ES
precision mediump float;
varying mediump vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif

uniform sampler2D u_texture;
uniform vec4 u_color;
uniform bool u_colorize;

const mat3 YUVtoRGB = mat3( 1.000,  1.000, 1.000,
							0.000, -0.344, 1.772,
							1.402, -0.714, 0.000 );

void main()
{
	if (u_colorize) {
		vec4 tex = texture2D(u_texture, v_texCoord);
		vec3 YUV = vec3(0.299*tex.r + 0.587*tex.g + 0.114*tex.b, u_color.rg);
		vec3 RGB = YUVtoRGB * YUV;
		gl_FragColor = tex.a*vec4(RGB, 1.0);
	} else {
	/*if (v_texCoord.x > 0.95 || v_texCoord.x < 0.05 || v_texCoord.y > 0.95 || v_texCoord.y < 0.05)
		gl_FragColor = vec4(1.0);
	else*/
		gl_FragColor = /*vec4(v_texCoord, 0.0, 1.0);*/ u_color*texture2D(u_texture, v_texCoord);
	}
}

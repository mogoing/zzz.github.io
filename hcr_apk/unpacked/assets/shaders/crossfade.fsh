#ifdef GL_ES
precision mediump float;
varying mediump vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif

uniform float u_fade;

uniform sampler2D u_texture;
uniform sampler2D u_textureAlt;

void main()
{
	vec4 a = texture2D(u_texture, v_texCoord);
	vec4 b = texture2D(u_textureAlt, v_texCoord);

	gl_FragColor = mix(a, b, u_fade);
}



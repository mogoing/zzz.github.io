#ifdef GL_ES
precision mediump float;
varying mediump vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif

uniform sampler2D u_texture;
uniform float u_param;

void main()
{
	vec2 tc = vec2(v_texCoord);
	tc.x += 0.1 * smoothstep(0.0, 0.75, 1.0-tc.y) * sin(2.0 * 3.141 * tc.y + u_param);

	gl_FragColor = texture2D(u_texture, tc);
}

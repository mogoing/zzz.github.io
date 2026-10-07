#ifdef GL_ES
precision mediump float;
varying mediump vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif

uniform sampler2D u_texture;
uniform vec4 u_params;

void main()
{
/*	vec2 tc = v_texCoord;
	float dx = u_params.x;
	float dy = u_params.y;

	float c = texture2D(u_texture, vec2(tc.x, tc.y)).a;
	float r = texture2D(u_texture, vec2(tc.x + dx, tc.y)).a;
	float l = texture2D(u_texture, vec2(tc.x - dx, tc.y)).a;
	float u = texture2D(u_texture, vec2(tc.x, tc.y + dy)).a;
	float d = texture2D(u_texture, vec2(tc.x, tc.y - dy)).a;

	float hp = abs(c-r) + abs(c-u) + abs(c-l) + abs(c-d);
	vec4 white = vec4(hp, hp, hp, c);

	r = texture2D(u_texture, vec2(tc.x - 3.0*dx, tc.y)).a;
	l = texture2D(u_texture, vec2(tc.x + 3.0*dx, tc.y)).a;
	u = texture2D(u_texture, vec2(tc.x, tc.y - 3.0*dy)).a;
	d = texture2D(u_texture, vec2(tc.x, tc.y + 3.0*dy)).a;

	hp = abs(c-r) + abs(c-u) + abs(c-l) + abs(c-d);
	vec4 purple = vec4(hp, 0.0, hp, c);

	gl_FragColor = white + purple;
*/
	float c = texture2D(u_texture, v_texCoord).a;
	vec4 chromakey = vec4(c, c, c, c);

	gl_FragColor = chromakey;//white + purple;
}

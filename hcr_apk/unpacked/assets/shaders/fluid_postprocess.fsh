#ifdef GL_ES
precision mediump float;
varying mediump vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif

uniform vec4 u_color;
uniform sampler2D u_texture;

void main()
{
	if (length(v_texCoord - vec2(0.5)) > 0.45)
		discard;

	const vec4 white = vec4(1.0);
	const vec4 yellow = vec4(1.0, 1.0, 0.0, 1.0);
	const vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
	const vec4 black = vec4(0.0);

	// use the field density value as color
	vec4 p = texture2D(u_texture, v_texCoord);
	float v = 2.0*length(p.xy - vec2(0.5, 0.5));

	vec4 c;
	float d = p.z;
	float t = v*d;

	if (t > 0.666)
		c = mix(yellow, white, (t - 0.666) / 0.333);
	else if (t > 0.333)
		c = mix(red, yellow, (t - 0.333) / 0.333);
	else
		c = mix(black, red, t / 0.333);

	p = c;

	gl_FragColor = p;

}

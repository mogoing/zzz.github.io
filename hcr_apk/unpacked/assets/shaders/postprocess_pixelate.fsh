#ifdef GL_ES
precision mediump float;
varying mediump vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif

uniform sampler2D u_texture;
uniform vec4 u_params;

/*
	float s = v_texCoord.s;	
	float t = v_texCoord.t;	

	// get q(s)
	float qs = 1.0 + 9.0*s*s;
	float q = 0.001*floor(qs + 0.5);

	// get distance to centroid
	float x = q*floor(s/q + 0.5*q);
	float y = t;

	vec2 texc = vec2(x, y);
	vec4 p = vec4(texture2D(u_texture, texc).rgb, 1.0);

	gl_FragColor = p;
*/

void main()
{
	float t = v_texCoord.t;	
	float qs = u_params.a;
	vec3 colorkey = vec3(1.0, 1.0, 1.0);
	float xOffset = 0.02*sin(30.0*t + 25.0*qs);
	vec4 orig = texture2D(u_texture, v_texCoord + vec2(xOffset, 0.0));

	if (orig.rgb == colorkey) {
		discard;
	}

	float s = v_texCoord.s;	
	float qt = u_params.a;
	float x = qs*floor(s/qs) + xOffset;
	float y = qt*floor(t/qt);

	vec2 texc = vec2(x, y);
	vec4 po = vec4(texture2D(u_texture, v_texCoord + vec2(xOffset, 0.0)).rgb, 1.0);
	vec4 p = vec4(texture2D(u_texture, texc).rgb, 1.0);
	qs = u_params.b;
	p.r = qs*floor(p.r/qs + 0.5*qs);
	p.g = qs*floor(p.g/qs + 0.5*qs);
	p.b = qs*floor(p.b/qs + 0.5*qs);

	float coef = cos(30.0*t + 25.0*qs);
	vec4 outp = mix(po, p, coef);

	gl_FragColor = outp;

}

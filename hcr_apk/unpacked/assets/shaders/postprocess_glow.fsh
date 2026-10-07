#ifdef GL_ES
precision mediump float;
varying mediump vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif

uniform sampler2D u_texture;
uniform vec4 u_params;

vec3 toNonLinear(vec3 rgb) {
	return sqrt(rgb);
}

vec3 toLinearVec3(vec3 rgb) {
	return rgb*rgb;
}

vec2 toLinearVec2(vec2 rb) {
	return rb*rb;
}

void main()
{
	vec3 colorkey = vec3(1.0, 1.0, 1.0);
	vec4 orig = texture2D(u_texture, v_texCoord);

	if (orig.rgb == colorkey) {
		discard;
	}

	float d = u_params.y;
	vec2 tc = v_texCoord;

	vec3 sum = 0.32*toLinearVec3(orig.rgb);

	sum.rb += 0.05*toLinearVec2(texture2D(u_texture, vec2(tc.x - 4.0*d, tc.y)).rb);
//	sum.b += 0.09*toLinearVec2(texture2D(u_texture, vec2(tc.x - 5.0*d, tc.y)).rb).y;
	sum.rb += 0.12*toLinearVec2(texture2D(u_texture, vec2(tc.x - 2.0*d, tc.y)).rb);
	sum.rgb += 0.15*toLinearVec3(texture2D(u_texture, vec2(tc.x - d, tc.y)).rgb);
	sum.rgb += 0.15*toLinearVec3(texture2D(u_texture, vec2(tc.x + d, tc.y)).rgb);
	sum.rb += 0.12*toLinearVec2(texture2D(u_texture, vec2(tc.x + 2.0*d, tc.y)).rb);
//	sum.b += 0.09*toLinearVec2(texture2D(u_texture, vec2(tc.x + 5.0*d, tc.y)).rb).y;
	sum.rb += 0.05*toLinearVec2(texture2D(u_texture, vec2(tc.x + 4.0*d, tc.y)).rb);

	sum.rb += 0.05*toLinearVec2(texture2D(u_texture, vec2(tc.x, tc.y - 4.0*d)).rb);
//	sum.b += 0.09*toLinearVec2(texture2D(u_texture, vec2(tc.x, tc.y - 5.0*d)).rb).y;
	sum.rb += 0.12*toLinearVec2(texture2D(u_texture, vec2(tc.x, tc.y - 2.0*d)).rb);
	sum.rgb += 0.15*toLinearVec3(texture2D(u_texture, vec2(tc.x, tc.y - d)).rgb);
	sum.rgb += 0.15*toLinearVec3(texture2D(u_texture, vec2(tc.x, tc.y + d)).rgb);
	sum.rb += 0.12*toLinearVec2(texture2D(u_texture, vec2(tc.x, tc.y + 2.0*d)).rb);
//	sum.b += 0.09*toLinearVec2(texture2D(u_texture, vec2(tc.x, tc.y + 5.0*d)).rb).y;
	sum.rb += 0.05*toLinearVec2(texture2D(u_texture, vec2(tc.x, tc.y + 4.0*d)).rb);

	vec3 o = toNonLinear(u_params.x*sum + toLinearVec3(orig.rgb));
	gl_FragColor = vec4(o.r, o.g, o.b, 1.0);

/*
	vec3 colorkey = vec3(1.0, 0.0, 1.0);
	vec4 orig = texture2D(u_texture, v_texCoord);

	if (orig.rgb == colorkey) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
		return;
	}
	vec2 tc = v_texCoord;
	float dx = u_params.y;
	float dy = u_params.y;

	float c = (texture2D(u_texture, vec2(tc.x, tc.y)).rgb == colorkey) ? 1.0 : 0.0;
	float r = (texture2D(u_texture, vec2(tc.x + dx, tc.y)).rgb == colorkey) ? 1.0 : 0.0;
	float l = (texture2D(u_texture, vec2(tc.x - dx, tc.y)).rgb == colorkey) ? 1.0 : 0.0;
	float u = (texture2D(u_texture, vec2(tc.x, tc.y + dy)).rgb == colorkey) ? 1.0 : 0.0;
	float d = (texture2D(u_texture, vec2(tc.x, tc.y - dy)).rgb == colorkey) ? 1.0 : 0.0;

	//float hp = (c-r) + (c-u) + (c-l) + (c-d);
	float hp = max(r + l + u + d - 4.0*c, 0.0);
	vec4 white = vec4(hp, hp, hp, hp);

	r = (texture2D(u_texture, vec2(tc.x - 2.0*dx, tc.y)).rgb == colorkey) ? 1.0 : 0.0;
	l = (texture2D(u_texture, vec2(tc.x + 2.0*dx, tc.y)).rgb == colorkey) ? 1.0 : 0.0;
	u = (texture2D(u_texture, vec2(tc.x, tc.y - 2.0*dy)).rgb == colorkey) ? 1.0 : 0.0;
	d = (texture2D(u_texture, vec2(tc.x, tc.y + 2.0*dy)).rgb == colorkey) ? 1.0 : 0.0;

	//hp = (c-r) + (c-u) + (c-l) + (c-d);
	hp = max(r + l + u + d - 4.0*c, 0.0);
	vec4 purple = vec4(hp, 0.0, hp, hp);

	vec4 o = white + purple;
	o = mix(orig, o, hp);

	gl_FragColor = o;
*/
/*
	vec4 o = texture2D(u_texture, vec2(tc.x, tc.y));
	vec3 chromakey = vec3(0.0, 0.0, 1.0);
	if (distance(chromakey, o.rgb) > 0.01)
		o = vec4(0.25, 0.25, 0.25, 1.0);
*/


}

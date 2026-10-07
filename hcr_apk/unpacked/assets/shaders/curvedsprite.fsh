#ifdef GL_ES
precision mediump float;
varying mediump vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif

uniform sampler2D u_texture;
uniform vec4 u_color;
uniform vec4 u_offsetAndSize;
uniform float u_squash;
uniform bool u_rotated;

void main()
{
	vec2 tc = v_texCoord;
	if (u_squash > 1.0) {
		float mid, t;
		if (!u_rotated) {
			mid = u_offsetAndSize.y + 0.4 * u_offsetAndSize.w;
			t = tc.y  - mid;
			if (t < 0.0)
				tc.y = max(mid + u_squash * t, u_offsetAndSize.y);
		} else {
			mid = u_offsetAndSize.x + 0.6 * u_offsetAndSize.z;
			t = tc.x  - mid;
			if (t > 0.0)
				tc.x = min(mid + u_squash * t, u_offsetAndSize.x + u_offsetAndSize.z);
		}
	}

	if (u_color == vec4(1.0, 0.0, 1.0, 1.0))
		gl_FragColor = vec4(texture2D(u_texture, tc).a);
	else
		gl_FragColor = u_color * texture2D(u_texture, tc);
}

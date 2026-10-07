#ifdef GL_ES
precision mediump float;
varying mediump vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif

uniform vec4 u_color;
uniform sampler2D u_texture;
uniform sampler2D u_textureliquid;

void main()
{
	vec4 field = texture2D(u_texture, v_texCoord);
	float threshold = 0.5 / 16.0;
	float d = threshold / field.a;

	if (d < 1.0) {
		vec2 center = vec2(0.5, 0.5);
		vec2 c = vec2(field.r, field.g) - center;
		vec2 texc = d*normalize(c);
		vec4 col = u_color*texture2D(u_textureliquid, texc + center);
		gl_FragColor = col;
	} 
	else {
		discard;
	}
}

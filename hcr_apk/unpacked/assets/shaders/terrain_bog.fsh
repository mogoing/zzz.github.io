#ifdef GL_ES
precision highp float;
varying highp vec2 v_texCoord;
varying highp float v_texCoord2;
varying highp vec2 v_pos;
#else
varying vec2 v_texCoord;
varying float v_texCoord2;
varying vec2 v_pos;
#endif

uniform sampler2D u_texture;
uniform sampler2D u_textureAlt;
uniform float u_fade;
uniform vec3 u_fadePosition;

void main()
{
    float mul = (0.7 + clamp(v_texCoord2*12.0, 0.0, 1.0) * 0.4) * (1.6 - v_texCoord2*0.7);
	vec4 a = texture2D(u_texture, v_texCoord) * mul;
	vec4 b = texture2D(u_textureAlt, v_texCoord) * mul;
	vec4 p = mix(a, b, u_fade);

	if (u_fadePosition.z > 0.0) {
		float d = length(v_pos);
		if (d < u_fadePosition.z)
			p.a = 0.0;
		else if (d < u_fadePosition.z + 0.25)
			p.a = 0.5;
	}    
	gl_FragColor = p;
}

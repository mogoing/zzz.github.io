#ifdef GL_ES
precision mediump float;
#endif

#ifdef GL_ES
varying mediump vec2 v_velocity;
#else
varying vec2 v_velocity;
#endif

// TODO: replace this with a texture lookup

void main()
{
	vec2 center = vec2(0.5, 0.5);
	vec2 c = vec2(gl_PointCoord) - center;

	float angle = atan(v_velocity.y, v_velocity.x);
	float vc = 1.0 - 0.333*min(length(v_velocity) / 12.0, 1.0);

	mat2 R = mat2(vc*cos(angle), sin(angle)/vc, 
				-vc*sin(angle), cos(angle)/vc);
	c = R*c;

	float f = max(0.0, (0.025 / length(c)) - 0.05);
	vec2 force = vec2(16.0*f*c.x, 16.0*f*c.y) + center;

	gl_FragColor = vec4(force.x, force.y, 0.0, f);

}

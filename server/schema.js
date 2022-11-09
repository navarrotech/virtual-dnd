export default {
    tables: [
        {
            name: 'users',
            security: {
                read: (req, res) => {
                    // Nobody can read any row in this table
                    return false
                },
                write: (req, res) => {
                    // Nobody can write any row in this table
                    return false 
                }
            },
            columns:[
                { column_name:'id',            data_type: 'BIGSERIAL', constraints: 'NOT NULL PRIMARY KEY', index:true },
                { column_name:'email',         data_type: 'character', constraints: 'varying(60) NOT NULL UNIQUE' },
                { column_name:'password',      data_type: 'character', constraints: 'varying(32)', hidden:true, },
                { column_name:'created',       data_type: 'timestamp', constraints: 'without time zone' },
                { column_name:'last_login',    data_type: 'timestamp', constraints: 'without time zone' },
                { column_name:'name',          data_type: 'character', constraints: 'varying(60)' },
            ]
        }
    ]
}